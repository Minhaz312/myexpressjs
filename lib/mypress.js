const http = require("http")
const routeHandler = require("./routeHandler")

const app = {}

app.createServer = (port=3000,options) => {
    const PORT = port;
    http.createServer((req,res)=>{
        routeHandler(req,res,options)
    }).listen(PORT,()=>console.log(`running on ${PORT} port`))
}
app.router = routeHandler

module.exports = app;