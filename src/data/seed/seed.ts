import { envs } from "../../config"
import { CategoryModel } from "../mongo/models/category.model"
import { ProductModel } from "../mongo/models/product.model"
import { UserModel } from "../mongo/models/user.model"
import { MongoDatabase } from "../mongo/mongo-database"
import { seedData } from "./data"


(async() => {

    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })

    await main()

    await MongoDatabase.disconnect()
    
})()

const randomBetweenXandZ = (x: number) => {
    return Math.floor( Math.random()*x)
}

async function main() {
    
    // 0. Borrar todo

    await Promise.all([
        UserModel.deleteMany(),
        ProductModel.deleteMany(),
        CategoryModel.deleteMany()
    ])

    // 1. Crear usuarios

    const users = await UserModel.insertMany(seedData.users)

    // 2. Crear categorias

    const categories = await CategoryModel.insertMany(
        seedData.categories.map(
        
        category => {
            return {
                ...category,
                user: users[randomBetweenXandZ(seedData.users.length -1)]._id
            }
        })
    )
    
    // 3. Crear productos

    const products = await ProductModel.insertMany(
        seedData.products.map(
            product => {
                return {
                    ...product,
                    user: users[randomBetweenXandZ(seedData.users.length -1)]._id,
                    category: categories[randomBetweenXandZ(seedData.categories.length -1)]._id
                }
            }
        )
    )

    console.log('SEEDED')
}