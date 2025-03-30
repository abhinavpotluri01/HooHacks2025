
import mongoose from "mongoose";
import shoeModel from "../models/shoeSchema.js";

export const shoeGet = async(req, res)=>{
    try{
        const jobs = await shoeModel.find()
        res.status(200).json({
            success: true,
            data: jobs
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            msg: `Server Error: ${error.name}`
        })
    }
}

export const shoePost = async (req, res)=>{
    const job = req.body

    console.log(job)
    const jobCreate = new shoeModel(job)
    try{
        await jobCreate.save()
        res.status(200).json({
            success: true,
            data: jobCreate
        })
    }
    catch(error){
        console.log(`Error: ${error.name}`)
        res.status(500).json({
            success: false,
            msg: `Server Error: There was an error creating the job (${error.name})`
        })
    }
}


/*
export const jobDelete = async (req, res) =>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({
            success: false,
            msg: "There was an error finding the id in param"
        })
    }
    try{
        await jobModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            msg: "The job was deleted"
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            msg: `There was an error deleting the product (${error.name})`
        })
    }
    
}
*/

