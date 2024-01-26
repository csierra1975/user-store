import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    available: {
        type: Boolean,
        default: true
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

// aqui podemos configurar como convertir el model a JSON
productSchema.set('toJSON', {
    virtuals: true, // añade el Id,
    versionKey: false, // no muestra la versión
    transform: function(doc, ret, options) { 
        delete ret._id // le decimos que no muestre el _id

        return ret
    }
})

export const ProductModel = mongoose.model('Product', productSchema)
