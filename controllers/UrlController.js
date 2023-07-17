const send = require("../lib/response");

const app = {}
app.getAllUrl = (req,res) => {
    console.log("get all url funcition called")
    const list = [
        {id:1,link:"https://whatisthis.com/as/ae/ad/adfawe/",tiny:"https://tiny.com/tibuits"},
        {id:2,link:"https://whatisthis.com/as/ae/ad/adfawe/",tiny:"https://tiny.com/tibuits"},
        {id:3,link:"https://whatisthis.com/as/ae/ad/adfawe/",tiny:"https://tiny.com/tibuits"},
        {id:4,link:"https://whatisthis.com/as/ae/ad/adfawe/",tiny:"https://tiny.com/tibuits"},
    ]
    send(res,500,list);
}

app.addUrl = (req,res) => {
    send(res,200,{success:true,message:"url added successfully"})
}

module.exports = app;