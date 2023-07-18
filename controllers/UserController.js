const fs = require("node:fs")
const send = require("../lib/response");

const userTable = JSON.parse(fs.readFileSync("database/users.json",{encoding:"utf-8"}))


const app = {}

app.getAllUser = (req,res) => {
    const list = [
        {id:0,name:"ashik",mail:"ashik@mail.com"},
        {id:1,name:"karim",mail:"karim@mail.com"},
        {id:2,name:"faruk",mail:"faruk@mail.com"},
    ]
    send(res,200,list)
}

app.registerUser = async (req,res) => {
    const data = JSON.parse(req.body)
    let currentUsersList = userTable;
    if(userTable.find(user=>user.mail===data.mail)!==undefined){
        console.log("user found")
        send(res,400,{success:false,message:"user already exist with the mail"})
    }else {
        currentUsersList.push(data);
        fs.writeFile("database/users.json",JSON.stringify(currentUsersList),(err)=>{
            console.log("inserted response: ",err);
            if(err){
                send(res,500,{success:false,message:"Failed to register!"})
            }else{
                send(res,200,{success:true,message:"Registration success"})
            }
        })
    }
}

app.loginUser = (req,res) => {
    send(res,200,"searching")
}

module.exports = app;