const fs = require("node:fs")

const userTable = JSON.parse(fs.readFileSync("database/users.json",{encoding:"utf-8"}))


const app = {}

app.getAllUser = (req,res) => {
    const list = [
        {id:0,name:"ashik",mail:"ashik@mail.com"},
        {id:1,name:"karim",mail:"karim@mail.com"},
        {id:2,name:"faruk",mail:"faruk@mail.com"},
        {name:"user get all functin called"}
    ]
    res.send(200,{},list)
}

app.registerUser = async (req,res) => {
    const data = JSON.parse(req.body)
    let currentUsersList = userTable;
    if(userTable.find(user=>user.mail===data.mail)!==undefined){
        console.log("user found")
        res.send(400,{},{success:false,message:"user already exist with the mail"})
    }else {
        currentUsersList.push(data);
        fs.writeFile("database/users.json",JSON.stringify(currentUsersList),(err)=>{
            console.log("inserted response: ",err);
            if(err){
                res.send(500,{},{success:false,message:"Failed to register!"})
            }else{
                res.send(200,{},{success:true,message:"Registration success"})
            }
        })
    }
}

app.loginUser = (req,res) => {
    console.log("req.params: ",req.params)
    // res.send(res,200,`my id is: ${req.params.id}`)
    res.send(200,{},`${req.params.id}`)
}

module.exports = app;