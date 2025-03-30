import mongoose from "mongoose";
import profileModel from "../models/profileSchema.js";

export const profileGet = async(req, res)=>{
    try{
        const profiles = await profileModel.find()
        res.status(200).json({
            success: true,
            data: profiles
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            msg: `Server Error: ${error.name}`
        })
    }
}

export const profileIndividualGet = async (req, res) =>{
    const {username} = req.params
    try{
        const profile = await profileModel.findOne({
            username: username
        })
        res.status(200).json({
            success: true,
            data: profile
        })
    }
    catch(err){
        console.log(err)
        req.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export const profilePost = async (req, res)=>{
    const profile = req.body

    if(!profile.username || !profile.password ){
        return res.status(400).json({
            success: false,
            message: "Please enter valid information in all fields"
        })
    }
    const profileCreate = new profileModel(profile)
    try{
        await profileCreate.save()
        res.status(200).json({
            success: true,
            data: profileCreate
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

export const profileUpdate = async (req, res) =>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({
            success: false,
            msg: "There was an error finding the id in param"
        })
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success: false,
            msg: "No jobs could be found with this ID"
        })
    }
    const profile = req.body
    if(!profile.username || !profile.password){
        return res.status(400).json({
            success: false,
            msg: "Please enter valid values for all the fields"
        })
    }
    try{
        await profileModel.findByIdAndUpdate(id, profile)
        res.status(200).json({
            success: true,
            data: profile
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            msg: `Server Error: There was an error updating the profile (${error.name})`
        })
    }
}

export const profileDelete = async (req, res) =>{
    const {id} = req.params
    if(!id){
        return res.status(400).json({
            success: false,
            msg: "There was an error finding the id in param"
        })
    }
    try{
        await profileModel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            msg: "The profile was deleted"
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            msg: `There was an error deleting the profile (${error.name})`
        })
    }
    
}

