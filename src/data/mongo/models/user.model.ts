import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique:true
    },
    emailValidated: {
        type: Boolean,
        default:false
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: ['ADMIN_ROLE', 'USER_ROLE']
    }
})

// aqui podemos configurar como convertir el model a JSON
userSchema.set('toJSON', {
    virtuals: true, // añade el Id,
    versionKey: false, // no muestra la versión
    transform: function(doc, ret, options) { 
        delete ret._id // le decimos que no muestre el _id
        delete ret.password
        return ret
    }
})

export const UserModel = mongoose.model('User', userSchema)
