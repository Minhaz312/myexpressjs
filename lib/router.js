const url = require("url")
const routes = require("./../routes/routes");
const send = require("./response");
const globalMiddleware = require("../config/globalMiddleware");
let router = {}

// middleware next functino




const routeHandler = (req,res,options) => {
    const requestedUrl = req.url;
    const parsedUrl = url.parse(requestedUrl,true)
    const requestedPathname = parsedUrl.pathname
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
            const routeMiddlewareExecution = (req,res,middlewareList) => {
                let j = 0;
                let mc = 0
                for (j; j < middlewareList.length; j++) {
                    const func = middlewareList[j];
                    func(req,res,(go,msg="unauthorized") => {
                        if(go){
                            if(j===middlewareList.length-1){
                                cb(req,res);
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
                                    cb(req,res);
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
                    cb(req,res);
                }else{
                    if(middlewareList.length>0){
                        routeMiddlewareExecution(req,res,middlewareList)
                    }else{
                        cb(req,res);
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