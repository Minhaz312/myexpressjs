const url = require("url")
const {StringDecoder} = require("node:string_decoder")

const decoder = new StringDecoder("utf-8")

const routes = require("./../routes/routes");
const send = require("./response");
const globalMiddleware = require("../config/globalMiddleware");
let router = {}

// middleware next functino


const getActualPathname = path => {
    const splitedPath = path.split("/");
    let newPath = ""
    let params = []
    splitedPath.map(item=>{
        if(item.indexOf(":")<0){
            newPath+=item+"/"
        }else{
            params.push(item.substring(1,item.length))
        }
    })
    console.log("newPath: ",newPath)
    console.log("params: ",params)
}

const routeHandler = (req,res,options) => {
    const requestedUrl = req.url;
    const parsedUrl = url.parse(requestedUrl,true)
    console.log("parsed url: ",parsedUrl)
    let requestedPathname = parsedUrl.pathname
    if(requestedPathname.indexOf(":")>0){
        getActualPathname(requestedPathname)
    }
    let count = 0
    routes.map(route=>{
        const [method,middleware,fn] = Object.entries(route)
        const actualRoutePathname = method[1]
        let toComparePathname =actualRoutePathname.trim("/");
        if(options.apiPrefix && actualRoutePathname!=="/"){
            toComparePathname = `/api/v${options.apiVersion}${actualRoutePathname.trim("/")}`
        }
        if(method[0].toLowerCase()===req.method.toLowerCase() && requestedPathname===toComparePathname.trim("/")){
            const cb = route.fn
            const callCallback = () => {
                let body = []
                req.on("data",(chunk)=>{
                    body.push(chunk)
                })
                req.on("end",()=>{
                    const data = decoder.write(Buffer.concat(body))
                    req.body = data
                    cb(req,res)
                })
            }
            const routeMiddlewareExecution = (req,res,middlewareList) => {
                let j = 0;
                let mc = 0
                for (j; j < middlewareList.length; j++) {
                    const func = middlewareList[j];
                    func(req,res,(go,msg="unauthorized") => {
                        if(go){
                            if(j===middlewareList.length-1){
                                callCallback()
                            }
                        }else{
                            j = middleware.length
                            send(res,401,msg)
                        }
                    })
                    mc++
                }
            }
            if(globalMiddleware.length>0){
                let globalMiddlewareList = globalMiddleware
                let routeMiddlewareList = route.middleware
                let j = 0;
                let mc = 0
                for (j; j < globalMiddlewareList.length; j++) {
                    const func = globalMiddlewareList[j];
                    func(req,res,(go,msg="unauthorized") => {
                        if(go){
                            if(j===globalMiddlewareList.length-1){
                                if(routeMiddlewareList.length>0){
                                    routeMiddlewareExecution(req,res,routeMiddlewareList)
                                }else{
                                    callCallback()
                                }
                            }
                        }else{
                            j = globalMiddlewareList.length
                            send(res,401,msg)
                        }
                    })
                    mc++
                }
            }else{
                const middlewareList = middleware[1]
                if(route.middleware===undefined){
                    callCallback()
                }else{
                    if(middlewareList.length>0){
                        routeMiddlewareExecution(req,res,middlewareList)
                    }else{
                        callCallback()
                    }
                }
            }
        }else{
            count++
        }
    })
    if(count===routes.length){
        res.statusCode = 404;
        res.write(`${req.method} ${requestedPathname} - not found`)
        res.end()
    }
}

module.exports = {routeHandler,router}























// class Router {
//     constructor(req,res){
//         this.req = req
//         this.res = res
//     }
//     get(pathname,cb){
//         const requestedUrl = this.req.url;
//         const parsedUrl = path.parse(requestedUrl,true)
//         const requestedPathname = parsedUrl.dir.trim("/")
//         if(this.req.method.toLowerCase()==="get" && requestedPathname===pathname){
//             cb(req,res)
//         }else{
//             this.res.statusCode(404);
//             this.res.write(`${req.method} ${pathname} not found`)
//         }
//     }
// }

// module.exports = Router