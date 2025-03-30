import mongoose from "mongoose";

const shoeSchema = new mongoose.Schema({
    imageURL: {
        type:String,
        required: true
    },
    realShoeArray: [{
        imageURL: String,
        title: String,
        price: String,
        link: String
    }]
})


const shoeModel = mongoose.model('shoe', shoeSchema)

export default shoeModel