import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";


export class AuthController {

    constructor(
        public readonly authService: AuthService
    ) {}

        
    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message})
        }

        return res.status(500).json({json: 'Internal server error' })
    }

    registerUser = (req:Request, res: Response) => {

        const [error, registerDto] = RegisterUserDto.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        if (error) return res.json(400).json(error)

        this.authService.registerUser(registerDto!)
        .then(user => res.json(user))
        .catch(error => this.handleError(error, res))
    }

    loginUser = (req:Request, res: Response) => {

        const [error, loginDto] = LoginUserDto.create({
            email: req.body.email,
            password: req.body.password
        })

        if (error) return res.json(400).json(error)

        this.authService.loginUser(loginDto!)
        .then(user => res.json(user))
        .catch(error => this.handleError(error, res))
    }

    validateEmail = (req:Request, res: Response) => {

        res.json('validateEmail')
    }
}