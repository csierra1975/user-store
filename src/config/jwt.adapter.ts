import jwt from 'jsonwebtoken'
import { envs } from './envs'


const JWT_SEED = envs.JWT_SEED // <= es una dependencia oculta que hay evitar. Habría que pasarlo por parámetro a los métodos

// en este adapter se usó classes por temas educativos. 
export class JwtAdapter {

    static async generateToken( payload: any, duration: string = '2h' ) {
        
        return new Promise ( resolve => {

            jwt.sign(payload, JWT_SEED, { expiresIn: duration}, (err, token) => {

                if (err) return resolve(null)

                resolve(token)
            })
        })
    }

    static validateToken<T>(token: string) : Promise<T|null>{

        return new Promise ( resolve => {

            jwt.verify(token, JWT_SEED, (err, decoded) =>{

                if ( err ) return resolve(null)

                resolve(decoded as T)
            })
        })
    }
}