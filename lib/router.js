const url = require("url")
const {StringDecoder} = require("node:string_decoder")

const decoder = new StringDecoder("utf-8")

const routes = require("./../routes/routes");
const send = require("./response");
const globalMiddleware = require("../config/globalMiddleware");
const getUrlParamsAndFormatedDefinedUrlwithParamsValue = require("./helpers/route/getUrlParams");
let router = {}

const routeHandler = (req,res,options) => {
    const requestedUrl = req.url;
    const requestMethod = req.method;
    const parsedUrl = url.parse(requestedUrl,true)
    let requestedPathname = parsedUrl.pathname==="/"?parsedUrl.pathname:parsedUrl.pathname.toString().substring(1).trim("/");
    let count = 0
    res.send = (statusCode,header,data) => {
        res.writeHead(statusCode,header)
        res.write(JSON.stringify(data))
        res.end()
    }
    for(let i = 0;i<routes.length;i++){
        let route = routes[i]
        const [method,middleware,fn] = Object.entries(route)
        const userDefinedMethod = method[0]
        let userDefinedRoute =method[1]
        const cb = fn[1]
        if(method[1]!=="/"){
            userDefinedRoute = `api/v${options.apiVersion}${method[1].trim("/")}`
        }

        const callCallback = (cb) => {
            let body = []
            req.on("data",(chunk)=>{
                body.push(chunk)
            })
            req.on("error",(err)=>{
                console.log("response err: ",err)`etd`
            })
            req.on("end",()=>{
                const data = decoder.write(Buffer.concat(body))
                req.body = data
                req.params = params
                cb(req,res)
            })
        }

        let params;
        let checkRouteFound;
        routes.map(item=>{
            const [testMethod,testMiddleware,testFn] = Object.entries(item)
            const testRoute = `api/v${options.apiVersion}${testMethod[1].trim("/")}`
            if(requestMethod.toLowerCase()===userDefinedMethod.toLowerCase() && testRoute === requestedPathname){
                checkRouteFound = true;
            }else{
                checkRouteFound = false
            }
        })
        if(checkRouteFound){
            i = routes.length
            callCallback(cb)
        }else{
            const requestedUrlLength = requestedPathname.split("/").length
            const userDefinedUrlLength = userDefinedRoute.split("/").length
            if(requestMethod.toLowerCase()==="get" || requestMethod.toLowerCase()==="delete" && userDefinedRoute.indexOf(":")>0 && requestedUrlLength===userDefinedUrlLength){
                const {routeParams,formatedUserDefinedRoute} = getUrlParamsAndFormatedDefinedUrlwithParamsValue(userDefinedRoute,requestedPathname,userDefinedMethod)
                params = routeParams
                userDefinedRoute = formatedUserDefinedRoute
            }else{
                params = {}
            }
            if(userDefinedMethod.toLowerCase()===requestMethod.toLowerCase() && requestedPathname===userDefinedRoute){
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
                                        callCallback(cb)
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
                        callCallback(cb)
                    }else{
                        if(middlewareList.length>0){
                            routeMiddlewareExecution(req,res,middlewareList)
                        }else{
                            callCallback(cb)
                        }
                    }
                }
            }else{
                count++
            }
        }
    }
    if(count===routes.length){
        res.statusCode = 404;
        res.write(`${requestMethod} ${requestedPathname} - not found`)
        res.end()
    }
}

module.exports = {routeHandler,router}

