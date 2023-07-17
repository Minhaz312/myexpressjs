const send = require("../lib/response");

const app = {}

app.getAllUser = (req,res) => {
    const list = [
        {id:0,name:"ashik",mail:"ashik@mail.com"},
        {id:1,name:"karim",mail:"karim@mail.com"},
        {id:2,name:"faruk",mail:"faruk@mail.com"},
    ]
    send(res,200,list)
}

module.exports = app;