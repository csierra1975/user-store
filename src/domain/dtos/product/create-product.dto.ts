import { Validators } from "../../../config"

export class CreateProductDto {

    private constructor (
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string,
    ){}

    static create( object: {[keys: string]: any}) : [string?, CreateProductDto?] {

        const { name, available, price, description, user, category } = object

console.log({ name, available, price, description, user, category })
        
if ( !name) return ['Missing name']
        if ( !user) return ['Missing user']
        if ( !category) return ['Missing vategory']

        if ( !Validators.isMongoId(category) ) return ['Invalid category Id']
        if ( !Validators.isMongoId(user)) return ['Invalid user Id']

        let availableBooelan = available
        if (typeof available !== 'boolean') {
            availableBooelan = (available === 'true')
        }

        if (isNaN(price)) return ['Price is not a number']
        if (price < 0) return ['Price can not be negative']

        return [undefined, new CreateProductDto(name, availableBooelan, price, description, user, category)]
    }
}