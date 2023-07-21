const fs = require("node:fs")
const has = require("../helpers/has")
const env = require("./../config/env")
const randomStringGenerator = require("../helpers/randomStringGenerator")
let linkTable = []
if(fs.readFileSync("database/urls.json",{encoding:"utf-8"})!==""){
    linkTable = JSON.parse(fs.readFileSync("database/urls.json",{encoding:"utf-8"}))
}

const app = {}
app.getAllUrl = (req,res) => {
    console.log("get all url funcition called")
    const list = []
    res.send(500,{},list);
}

app.redirectUrl = (req,res) => {
    const {tiny} = req.params
    const findUrl = linkTable.find(item=>item.tiny===tiny)
    if(findUrl!==undefined) {
        const index = linkTable.indexOf(findUrl);
        const updatedLink = {}
        updatedLink.id = findUrl.id;
        updatedLink.userId = findUrl.userId;
        updatedLink.link = findUrl.link;
        updatedLink.tiny = findUrl.tiny;
        updatedLink.totalRequest = Number(findUrl.totalRequest)+1;
        linkTable.splice(index,1,updatedLink)
        fs.writeFileSync("database/urls.json",JSON.stringify(linkTable));
        res.redirect(findUrl.link)
    }else{
        res.send(400,{},{success:false,message:"Url is invalid or expired!"})
    }
}

app.addUrl = (req,res) => {
    const data = JSON.parse(req.body)
    if(has(data,"userId")===true && has(data,"link")){
        const tiny = randomStringGenerator(8);
        const newLink = {id:1,userId:data.userId,link:data.link,tiny:tiny,totalRequest:0}
        linkTable.push(newLink);
        fs.writeFileSync("database/urls.json",JSON.stringify(linkTable));
        res.send(200,{},{success:true,message:"Link added successfully"})
    }else{
        res.send(400,{},{success:false,message:"Provide all data"})
    }
}

app.getUrlById = (req,res) => {
    try {
        const {id} = JSON.parse(req.params);
        res.send(200,{},id);
    } catch (error) {
        res.send(500,{},"failed");
    }
}

app.deleteUrl = (req,res) => {

}

app.updateUrl = (req,res) => {

}

module.exports = app;