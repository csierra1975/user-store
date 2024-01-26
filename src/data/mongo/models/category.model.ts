import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    available: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

// aqui podemos configurar como convertir el model a JSON
categorySchema.set('toJSON', {
    virtuals: true, // añade el Id,
    versionKey: false, // no muestra la versión
    transform: function(doc, ret, options) { 
        delete ret._id // le decimos que no muestre el _id

        return ret
    }
})

export const CategoryModel = mongoose.model('Category', categorySchema)
