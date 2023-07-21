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
    res.send(500,{},linkTable);
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
    const data = req.body
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
        const findUrl = linkTable.find(item=>Number(item.id)===Number(id))
        if(findUrl!==undefined){
            res.send(200,{},{success:true,url:findUrl});
        }else{
            res.send(400,{},{success:false,url:{}});
        }
    } catch (error) {
        res.send(500,{},{success:false,url:{}});
    }
}

app.deleteUrl = (req,res) => {
    try {
        const {id} = JSON.parse(req.params);
        const findUrl = linkTable.find(item=>Number(item.id)===Number(id))
        if(findUrl!==undefined){
            const index = linkTable.indexOf(findUrl);
            linkTable.splice(index,1)
            fs.writeFileSync("database/urls.json",JSON.stringify(linkTable));
            res.send(200,{},{success:true,url:findUrl,message:"Deleted successfully"});
        }else{
            res.send(400,{},{success:false,url:{},message:"Failed to delete!"});
        }
    } catch (error) {
        res.send(500,{},{success:false,url:{},message:"Failed to delete!"});
    }
}

app.updateUrl = (req,res) => {
    try {
        const {id,link} = req.params
        const findUrl = linkTable.find(item=>Number(item.id)===Number(id))
        if(findUrl!==undefined) {
            const index = linkTable.indexOf(findUrl);
            const updatedLink = {}
            updatedLink.id = findUrl.id;
            updatedLink.userId = findUrl.userId;
            updatedLink.link = link;
            updatedLink.tiny = findUrl.tiny;
            updatedLink.totalRequest = Number(findUrl.totalRequest)+1;
            linkTable.splice(index,1,updatedLink)
            fs.writeFileSync("database/urls.json",JSON.stringify(linkTable));
            res.send(200,{},{success:true,message:"Updated successfully"});
        }else{
            res.send(400,{},{success:false,message:"Failed to update!"})
        }
    } catch (error) {
        res.send(500,{},{success:false,message:"Failed to update!"})
    }
}

module.exports = app;