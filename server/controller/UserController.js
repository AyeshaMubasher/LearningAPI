import dotenv from 'dotenv';
dotenv.config();
import { UserModel } from "../Posgres/postgres.js"
import bcrypt from 'bcrypt'
import { response, text } from "express";
import jwt from 'jsonwebtoken'
import sgMail from '@sendgrid/mail';

//used in home page and edit profile page 
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

//user Login
export const checkUser=async(req,res)=>{
    const {email,password}=req.body;
    try{
    const user= await UserModel.findOne({where:{email:email}});
        if(user){
            const isMatch = await bcrypt.compare(password,user.password)
            if(isMatch){
                const token = jwt.sign({userId: user.id},process.env.JWT_Secret_Key,{
                    expiresIn: "5h"
                });
                return res.json({token});
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

//for verifying token
export const verifyToken= async(req,res,next)=>{
    const token = req.header("Authorization");
    if(!token){
        return res.status(401).json({message:"Access Denied"});
    }
    try{
        const decoded = jwt.verify(
           token.split(" ")[1],
           process.env.JWT_Secret_Key 
        );
        req.user = decoded;
        next();
    }
    catch (error){
        console.error("Error verifying token:", error);
        res.status(401).json({message:"Invalid Token"});
    }
}

//used at home page,profile page
export const getUserData= async(req,res)=>{
    let id=req.user.userId;
    try{
        const usr= await UserModel.findOne({where:{id:id}})
        if(usr==null){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(usr)
    }
    catch(error){
        console.log(error)
        return res.status(500).json({"error":"Internal server error"})
    }
}

//use in register
export const addUser=async(req,res)=>{
    console.log(req.body);
    let {FirstName,LastName,email} = req.body;

    let password=((Math.floor(Math.random()*(9999-1000)+1))+1000)+"";
    console.log(password)
    //add code to automatically generate email and send to the user
    sgMail.setApiKey(process.env.API_KEY);
    const message ={
        to: email,
        from: "ayeshaMubasher28@gmail.com",
        subject: "Your Login Code for Unlock Me",
        text: "password: "+password,
        html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: auto;
        }
        .header {
          text-align: center;
          color: #333333;
        }
        .code {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #007BFF;
          margin-top: 20px;
          text-align: center;
        }
        .footer {
          text-align: center;
          color: #888888;
          margin-top: 30px;
          font-size: 12px;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
      </style>
    </head>
    <body>

      <div class="container">
        <div class="header">
          <h2>Welcome to Unlock Me</h2>
          <p>To securely log into your account, please use the following code:</p>
        </div>

        <div class="code">
          ${password} <!-- Insert the dynamically generated code here -->
        </div>

        <div class="footer">
          <p>If you need assistance, feel free to reach out to us at <a href="ayeshamubasher28@gmail.com">ayeshamubasher28@gmail.com</a>.</p>
          <p>Best regards, <br>The Unlock Me Team</p>
        </div>
      </div>

    </body>
    </html>
  `,
    };

    sgMail
    .send(message)
    .then((response)=> console.log('Email sent'))
    .catch((error)=> console.log(error.message));



    password = await bcrypt.hash(password, 10)// password encryption 

    
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

//used in profile 
export const updateUser=async(req,res)=>{
    let id=req.user.userId;
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

