import { JwtAdapter } from "../../config";
import { bcryptAdapter } from "../../config/bcrypt.adapter";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";


export class AuthService {

    constructor(){

    }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({email: registerUserDto.email})

        if (existUser) throw CustomError.badRequest('Email already exsits')

        try{

            const user = new UserModel(registerUserDto)

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save()

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
}