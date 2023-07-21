const fs = require("node:fs")
const jwt = require("jsonwebtoken")
const env = require("../config/env")

const SECRET = env.JWT_SECRET

const userTable = JSON.parse(fs.readFileSync("database/users.json",{encoding:"utf-8"}))


const app = {}

app.getAllUser = (req,res) => {
    res.send(200,{},userTable)
}

app.getUserById = (req,res) => {
    const {id} = req.params
    const userById = userTable.find(user=> user.id===Number(id));
    if(userById===undefined){
        res.send(200,{},{success:false,user:{},message:"user not found with the id"})
    }else{
        res.send(200,{},{success:true,user:userById,message:"user found"})
    }
}

app.registerUser = (req,res) => {
    console.log("registration")
    const data = JSON.parse(req.body)
    let currentUsersList = userTable;
    if(userTable.find(user=>user.mail===data.mail)!==undefined){
        res.send(400,{},{success:false,message:"user already exist with the mail"})
    }else {
        const newUser = {}
        newUser.id = userTable.length>0?userTable[userTable.length-1].id+1:1
        newUser.name = data.name
        newUser.mail = data.mail
        newUser.password = data.password
        currentUsersList.push(newUser);
        fs.writeFile("database/users.json",JSON.stringify(currentUsersList),(err)=>{
            if(err){
                res.send(500,{},{success:false,message:"Failed to register!"})
            }else{
                res.send(200,{},{success:true,message:"Registration success"})
            }
        })
    }
}

app.deleteUser = (req,res) => {
    const {id} = req.params;
    const user = userTable.find(user=>user.id===Number(id));
    if(user!==undefined){
        const index = userTable.indexOf(user);
        userTable.splice(index,1)
        fs.writeFileSync("database/users.json",JSON.stringify(userTable));
        res.send(200,{},{success:true,message:"Deleted successfully!"});
    }else{
        res.send(400,{},{success:false,message:"User not found!"});
    }
}

app.userUpdate = (req,res) => {
    const data = JSON.parse(req.body);
    let updatedData = {}
    console.log("data: ",data)
    const user = userTable.find(user=>Number(user.id)===Number(data.id));
    if(user!==undefined){
        console.log("user: ",user)
        updatedData.id = data.id
        const index = userTable.indexOf(user);
        console.log("index: ",index)
        if(data.name!==undefined && data.name!==null && data.name!==""){
            updatedData.name = data.name
        }else{
            updatedData.name = user.name
        }
        if(data.mail!==undefined && data.mail!==null && data.mail!==""){
            updatedData.mail = data.mail
        }else{
            updatedData.mail = user.mail
        }
        if(data.password!==undefined && data.password!==null && data.password!==""){
            updatedData.password = data.password
        }else {
            updatedData.password = user.password
        }
        console.log("updatedData: ",updatedData)
        userTable.splice(index,1,updatedData)
        fs.writeFileSync("database/users.json",JSON.stringify(userTable));
        res.send(200,{},{success:true,message:"Updated successfully!"});
    }else{
        res.send(400,{},{success:false,message:"User not found"});
    }
}

app.loginUser = (req,res) => {
    try {
        const {mail,password} = JSON.parse(req.body);
        const user = userTable.find(item=>item.mail===mail&item.password.toString()===password.toString());
        console.log("user: ",user)
        if(user!==undefined){
            const token = jwt.sign({user:mail,loggedIn:true},SECRET,{algorithm:"HS256"});
            res.send(200,{},{success:true,token:token,message:"user loggedin"})
        }else{
            res.send(400,{},{success:false,token:null,message:"Invalid email or password"})
        }
    } catch (error) {
        res.send(500,{},{success:false,token:null,message:"Invalid email or password"})
    }
}

module.exports = app;