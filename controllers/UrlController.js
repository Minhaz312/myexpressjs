const fs = require("node:fs")
const has = require("../helpers/has")
const url = require("url")
const linkTable = JSON.parse(fs.readFileSync("database/urls.json",{encoding:"utf-8"}))

const app = {}
app.getAllUrl = (req,res) => {
    console.log("get all url funcition called")
    const list = []
    res.send(500,{},list);
}

app.addUrl = (req,res) => {
    const data = JSON.parse(req.body)
    if(has(data,"userId")===true && has(data,"link")){
        const tinyLink = url.parse(req.url).hostname+"tiny";
        const newLink = {id:1,userId:data.userId,link:data.link,tiny:tinyLink}
        linkTable.push(newLink);
        fs.writeFileSync("database/urls.json",JSON.stringify(newLink));
        res.send(200,{},{success:true,message:"Link added successfully"})
    }else{
        res.send(400,{},{success:false,message:"Provide all data"})
    }
}

module.exports = app;