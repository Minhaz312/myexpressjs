const fs = require("node:fs")

const userTable = JSON.parse(fs.readFileSync("database/users.json",{encoding:"utf-8"}))


const app = {}

app.getAllUser = (req,res) => {
    console.log("usertable: ",JSON.stringify(userTable))
    res.send(200,{},userTable)
}

app.getUserById = (req,res) => {
    console.log("cb called",req.params)
    const {id} = req.params
    const userById = userTable.find(user=> user.id===Number(id));
    if(userById===undefined){
        res.send(200,{},{success:false,user:{},message:"user not found with the id"})
    }else{
        res.send(200,{},{success:true,user:userById,message:"user found"})
    }
}

app.registerUser = (req,res) => {
    const data = JSON.parse(req.body)
    let currentUsersList = userTable;
    if(userTable.find(user=>user.mail===data.mail)!==undefined){
        res.send(400,{},{success:false,message:"user already exist with the mail"})
    }else {
        const newUser = {}
        newUser.id = userTable[userTable.length-1].id+1
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
    }
    res.send(200,{},"no")
}

app.loginUser = (req,res) => {
    console.log("req.params: ",req.params)
    // res.send(res,200,`my id is: ${req.params.id}`)
    res.send(200,{},`${req.params.id}`)
}

module.exports = app;