import User from "../models/user.model.js";
import { signUpParser, loginParser } from "../validations/auth.validation.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export async function registerUser(req, res){
    
    try{

        const user = req.body;
        
        
        const parse = signUpParser.safeParse(user);

        if(!parse.success){
            return res.status(400).json({
                msg: parse.error.format
            });
        }

        const exists = await User.findOne({email:user.email}); 

        if(exists){
            return res.status(409).json({
                msg: 'Email already registered.'
            });
        }

        const hashed = await bcrypt.hash(user.password,10);

        const newUser = await User.create({
            username: user.username,
            email: user.email,
            password: hashed
        });
        
        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
            username: newUser.username
        }, process.env.ACCESS_SECRET, {
            expiresIn: '1m'
        });

        return res.status(201).json({
            success: true,
            token: token
        });
        
    }
    catch(error){
        console.log(`Error registering user: ${error}`);

        return res.status(503).json({
            msg: 'Internal server error.'
        })
    }

}


export async function loginUser(req, res){
    try{ 

        const { email, password } = req.body;
        const parse = loginParser.safeParse({
            email,
            password
        });

        if(!parse.success){
            return res.status(400).json({
                msg: parse.error
            });
        }

        
        const user = await User.findOne({
            email: email,
        }).select("_id password username email");
        
        if(!user){
            return res.status(401).json({
                msg: 'Incorrect login details.'
            });
        }

        const check = await bcrypt.compare(password, user.password)
        
        if(!check){
            return res.status(401).json({
                msg: 'Incorrect password.'
            });
        }
        
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username
        }, process.env.ACCESS_SECRET, {
            expiresIn: '1d'
        });

        return res.status(201).json({
            success: true,
            token: token
        });

    }
    catch(err){
        
        console.log(`Error logining user: ${err}`);
        return res.status(503).json({
            msg: 'Internal server error.'
        });
        
    }
}