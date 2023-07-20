const {StringDecoder} = require("node:string_decoder")

const decoder = new StringDecoder("utf-8")
const globalMiddleware = require("./../../../config/globalMiddleware")


const callCallback = (cb,req,res,params) => {
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

const send = (res,status=200,data={}) =>{
    const STATUS = status;
    const DATA = data;
    res.statusCode = status;
    res.write(typeof data === "object"?JSON.stringify(DATA):DATA)
    res.end()
}

const executeRoute = (req,res,params,route) => {
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
    const [routePath,routeMiddleware,fn] = Object.entries(route)
    const cb = fn[1]
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
                            callCallback(cb,req,res,params)
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
        const middlewareList = routeMiddleware[1]
        if(route.middleware===undefined){
            callCallback(cb,req,res,params)
        }else{
            if(middlewareList.length>0){
                routeMiddlewareExecution(req,res,middlewareList)
            }else{
                callCallback(cb,req,res,params)
            }
        }
    }
}

module.exports = executeRoute