import mongoose from "mongoose";

const shoeSchema = new mongoose.Schema({
    imageURL: {
        type:String,
        required: true
    },
    realShoeArray: [{
        
            imageURL: {
              type: String,
              required: [true, "Image URL is required for each shoe"],
            },
            title: {
              type: String,
              required: [true, "Title is required for each shoe"],
            },
            price: {
              type: String,
              required: [true, "Price is required for each shoe"],
              
            },
            link: {
              type: String,
              required: [true, "Link is required for each shoe"],
            },
            globalRanking: {
              type: String,
              required: [true, "Global ranking is required for each shoe"],
              
            },
          
    },]
})


const shoeModel = mongoose.model('shoe', shoeSchema)

export default shoeModel