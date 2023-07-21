const fs = require("node:fs")
const has = require("../helpers/has")
const randomStringGenerator = require("../helpers/randomStringGenerator")
let linkTable = []
if(fs.readFileSync("database/urls.json",{encoding:"utf-8"})){
    linkTable = JSON.parse(fs.readFileSync("database/urls.json",{encoding:"utf-8"}))
}

const app = {}
app.getAllUrl = (req,res) => {
    console.log("get all url funcition called")
    const list = []
    res.send(500,{},list);
}

app.redirectUrl = (req,res) => {
    // make a functionality not to wrapp the tiny url with api/v1
    res.redirect("https://www.facebook.com")
}

app.addUrl = (req,res) => {
    const data = JSON.parse(req.body)
    console.log("table: ",linkTable)
    if(has(data,"userId")===true && has(data,"link")){
        const tiny = randomStringGenerator(8);
        const tinyLink = `http://localhost:3000/${tiny}`;
        const newLink = {id:1,userId:data.userId,link:data.link,tiny:tinyLink,totalRequest:0}
        linkTable.push(newLink);
        fs.writeFileSync("database/urls.json",JSON.stringify(newLink));
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