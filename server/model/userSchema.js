
import { DataTypes } from "sequelize";

export const createUserModel=async(sequelize)=>{

    const User=sequelize.define('User' , {
        FirstName:{
            type:DataTypes.STRING,
            allowNull: false
        },
        LastName:{
            type:DataTypes.STRING,
            allowNull: false
        },
        email:{
            type:DataTypes.STRING,
            allowNull: false,
            isLowercase:true,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            validate: {
                notNull: {
                  msg: "Password is required"
                },
                notEmpty: {
                  msg: "Password is required"
                }
              },
            unique:true
        },
        Address:{
            type:DataTypes.STRING,
            allowNull: true
        },
        PhoneNumber:{
            type:DataTypes.STRING,
            allowNull: true
        }
    })
    return User;
}