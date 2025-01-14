import { UserModel } from "../Posgres/postgres.js"
import bcrypt from 'bcrypt'

export const getAllUsers=async(req,res)=>{
    try{
    const users= await UserModel.findAll();
        if(users.length==0){
            return res.status(200).json({"error":"users not found"})
        }
        return res.status(200).json(users)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"error":"Internal server error"})
    }
}

export const checkUser=async(req,res)=>{
    const {email,password}=req.body;
    try{
    const user= await UserModel.findOne({where:{email:email}});
        if(user){
            const isMatch = await bcrypt.compare(password,user.password)
            if(isMatch){
                return res.status(200).json(user)
                }
                return res.status(401).json({"error":"Password Incorrect!"})
        }
        else{
            return res.status(404).json({"error":"user not found"})
        }
        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"error":"Internal server error"})
    }
}

export const addUser=async(req,res)=>{
    console.log(req.body);
    let {FirstName,LastName,email,password} = req.body;

    password = await bcrypt.hash(password, 10)

    console.log(password)
    const data={
        FirstName,LastName,email,password
    }
    try{
        const usr= await UserModel.findOne({where:{email:email}})
        if(usr==null){
            await UserModel.create(data);
            return res.status(201).json({message:"User added successfully"})
        }
        else{
            return res.status(501).json({error:"already found"})
        }
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"error":"Internal server error"})
    }
}


export const updateUser=async(req,res)=>{
    let id=req.params.id;
    try{
        console.log("User id to get",id);
        const usr=await UserModel.update(req.body,{where:{id:id}})
        console.log("User id result",usr);
        if(usr[0]==0){
            return res.status(404).json({message:"Not found!"})
        }
        return res.status(200).json({message:"updated successfully"})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"error":"Internal server error"})
    }
}

export const deleteUser=async(req,res)=>{
    let id=req.params.id;
    try{
        const usr= await UserModel.findOne({where:{id:id}})
        if(usr==null){
            return res.status(404).json({message:"User not found"})
        }
        await usr.destroy();
        return res.status(200).json({message:"deleted successfully"})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"error":"Internal server error"})
    }
}
