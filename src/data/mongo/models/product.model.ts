import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    }
})

export const ProdcutModel = mongoose.model('Product', productSchema)
