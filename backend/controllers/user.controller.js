import { success } from "zod";
import User from "../models/user.model.js";




export async function getUser(req, res){
    try {

        const user = req.user;
        const userData = await User.findOne({email:user.email});

        if(!userData){
            return res.status(401).json({
                msg: "User not found."
            });

        }
        return res.status(201).json({
            success: true,
            user
        })

    } 
    catch (error) {
        
        console.log(`Error creating user: ${error}`);
        
        return req.status(503).json({
            msg: "Internal server error."
        })
    }
    
    
}


export async function searchUser(req, res){
    try {
        
        const { q } = req.query;

        console.log(q);
        
        
        if(!q || q.length < 2){
            return res.status(400).json({
                msg: "Insufficient prefix."
            })
        }
        
        const results = await User.find({
            username: {$regex: '^' + q, $options: 'i' }
        }).limit(10).select("username email _id")
        ;
        
        return res.status(200).json({
            success: true,
            results
        });
        
    } 
    catch (error) {
        
        console.log(`Error searching user: ${error}`);

        return res.status(503).json({
            msg: "Internal server error."
        })
    }
}