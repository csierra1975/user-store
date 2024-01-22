import { JwtAdapter, envs } from "../../config";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    constructor(
        private readonly emailService: EmailService
    ){}

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({email: registerUserDto.email})

        if (existUser) throw CustomError.badRequest('Email already exsits')

        try{

            const user = new UserModel(registerUserDto)

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save()

            await this.sendEmailValidationLink(user.email)

            const {password, ...userEntity} = UserEntity.fromObject(user)

            const token = await JwtAdapter.generateToken({ id: user.id })
            if (!token) throw CustomError.internalServe('Error while creating jwt')

            return {
                user: userEntity,
                token
            }

        } catch(error){
            throw CustomError.internalServe(`${error}`)
        }
        
        return 'todo ok!'
    }
    
    public async loginUser(loginUserDto: LoginUserDto){

        const user = await UserModel.findOne({email: loginUserDto.email})

        if (!user) throw CustomError.notfound('User not exist')

        const validPassword = bcryptAdapter.compare(loginUserDto.password, user.password)

        if (!validPassword) throw CustomError.badRequest('Email and/or password wrong')

        const {password, ...userEntity} = UserEntity.fromObject(user)

        const token = await JwtAdapter.generateToken({ id: user.id })
        if (!token) throw CustomError.internalServe('Error while creating jwt')

        return {
            user: userEntity,
            token
        }
    }

    private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({email})

        if (!token) throw CustomError.internalServe('Error getting token')

        const link = `${envs.WEB_SERVICE_URL}api/auth/validate-email/${token}`

        const html = `
            <h1>Validate your email</h1>
            <p>Click on that follwing link to validate you email</p>
            <a href=${ link }>Validate your email: ${email}</a>
        `
        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
            attachments: []
        }

        const isSent = await this.emailService.sendEmail(options)

        if (!isSent) throw CustomError.internalServe('Error sending email')
        
        return true
    }

    public validateEmail = async(token: string) => {

        console.log({token}, '+++++++++++++++++++++++++++++++++++++')
        const payload = await JwtAdapter.validateToken(token)
        if (!payload) throw CustomError.unauthorized('Invalid token')

        console.log({payload}, '+++++++++++++++++++++++++++++++++++++')

        const { email } = payload as { email: string} // un objeto con una prop email
        if (!email) throw CustomError.internalServe('Email not in token')

        const user = await UserModel.findOne({email})
        if (!user) throw CustomError.internalServe('Email not exists')
        user.emailValidated = true

        await user.save()

        return true
    }
}