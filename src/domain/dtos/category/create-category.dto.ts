

export class CreateCategoryDto {

    private constructor (
        public readonly name: string,
        public readonly available: boolean
    ){}

    static create( object: {[keys: string]: any}) : [string?, CreateCategoryDto?] {

        const { name, available = false } = object

        let availableBooelan = available
        if ( !name) return ['Missing name']

        if (typeof available !== 'boolean') {
            availableBooelan = (available === 'true')
        }

        return [undefined, new CreateCategoryDto(name, availableBooelan)]
    }
}