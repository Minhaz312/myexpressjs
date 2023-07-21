const url = require("url")

const routes = require("../routes/routes");
const getUrlParamsAndFormatedDefinedUrlwithParamsValue = require("./helpers/route/getUrlParams");
const checkRoutesEquality = require("./helpers/route/checkRoutesEquality");
const executeRoute = require("./helpers/route/executeRoute");

const routeHandler = (req,res,options) => {
    const requestedUrl = req.url;
    const requestMethod = req.method.toLowerCase();
    const parsedUrl = url.parse(requestedUrl,true)
    let requestedPathname = parsedUrl.pathname==="/"?parsedUrl.pathname:parsedUrl.pathname.toString().substring(1).trim("/");
    const requestedPathnameSplited = requestedPathname.split("/");
    let count = 0
    res.send = (statusCode,header,data) => {
        const DATA = data;
        res.writeHead(statusCode,header)
        res.write(typeof DATA === "object"?JSON.stringify(DATA):DATA)
        res.end()
    }
    res.redirect = (location) => {
        const LOCATION = location;
        res.writeHead(302,{"location":`${LOCATION}`})
        res.end()
    }

    
    console.log("1) requested route: ",requestedPathname)

    // for(let i = 0;i<routes.length;i++){
    //     let route = routes[i]
    //     const [method,middleware,fn] = Object.entries(route)
    //     const userDefinedMethod = method[0]
    //     let userDefinedRoute =method[1]
    //     const cb = fn[1]
    //     if(method[1]!=="/"){
    //         userDefinedRoute = `api/v${options.apiVersion}${method[1].trim("/")}`
    //     }
    //     let params;
    //     console.log("2) userdefined route[%s]: ",i,userDefinedRoute)
    //     // let checkRouteFound = routes.find(item=>{
    //     //     const [testMethod,testMiddleware,testFn] = Object.entries(item)
    //     //     const testRoute = `api/v${options.apiVersion}${testMethod[1].trim("/")}`
    //     //     console.log("testRoute: ",testRoute)
    //     //     console.log("requestedPathname: ",requestedPathname)
    //     //     if(requestMethod.toLowerCase()===userDefinedMethod.toLowerCase() && testRoute === requestedPathname){
    //     //         return true;
    //     //     }else{
    //     //         return false
    //     //     }
    //     // })

    //     let checkRouteFound = routeIsDynamic(requestedPathname,userDefinedRoute,requestMethod,userDefinedMethod)
    //     if(checkRouteFound===false){
    //         console.log("3) route is static: ")
    //         i = routes.length
    //         params = {}
    //         callCallback(cb,req,res,params)
    //         console.log("4) request end and call callback")
    //     }else{
    //         console.log("3) route is dynamic and entered dynamic block")
    //         const requestedUrlLength = requestedPathname.split("/").length
    //         const userDefinedUrlLength = userDefinedRoute.split("/").length
    //         if(requestMethod.toLowerCase()==="get" || requestMethod.toLowerCase()==="delete" && userDefinedRoute.indexOf(":")>0 && requestedUrlLength===userDefinedUrlLength){
    //             const {routeParams,formatedUserDefinedRoute} = getUrlParamsAndFormatedDefinedUrlwithParamsValue(userDefinedRoute,requestedPathname,userDefinedMethod)
    //             params = routeParams
    //             userDefinedRoute = formatedUserDefinedRoute
    //         }else{
    //             params = {}
    //         }
    //         console.log("4) route is modified using passed route value id",userDefinedRoute)
    //         if(userDefinedMethod.toLowerCase()===requestMethod.toLowerCase() && requestedPathname===userDefinedRoute){
    //             console.log("4) route is matched, these are: ",requestedPathname," and ",userDefinedRoute)
    //             const routeMiddlewareExecution = (req,res,middlewareList) => {
    //                 let j = 0;
    //                 let mc = 0
    //                 for (j; j < middlewareList.length; j++) {
    //                     const func = middlewareList[j];
    //                     func(req,res,(go,msg="unauthorized") => {
    //                         if(go){
    //                             if(j===middlewareList.length-1){
    //                                 callCallback()
    //                             }
    //                         }else{
    //                             j = middleware.length
    //                             send(res,401,msg)
    //                         }
    //                     })
    //                     mc++
    //                 }
    //             }
    //             if(globalMiddleware.length>0){
    //                 let globalMiddlewareList = globalMiddleware
    //                 let routeMiddlewareList = route.middleware
    //                 let j = 0;
    //                 let mc = 0
    //                 for (j; j < globalMiddlewareList.length; j++) {
    //                     const func = globalMiddlewareList[j];
    //                     func(req,res,(go,msg="unauthorized") => {
    //                         if(go){
    //                             if(j===globalMiddlewareList.length-1){
    //                                 if(routeMiddlewareList.length>0){
    //                                     routeMiddlewareExecution(req,res,routeMiddlewareList)
    //                                 }else{
    //                                     callCallback(cb,req,res,params)
    //                                 }
    //                             }
    //                         }else{
    //                             j = globalMiddlewareList.length
    //                             send(res,401,msg)
    //                         }
    //                     })
    //                     mc++
    //                 }
    //             }else{
    //                 const middlewareList = middleware[1]
    //                 if(route.middleware===undefined){
    //                     callCallback(cb,req,res,params)
    //                     i = routes.length
    //                 }else{
    //                     if(middlewareList.length>0){
    //                         routeMiddlewareExecution(req,res,middlewareList)
    //                     }else{
    //                         i = routes.length
    //                         callCallback(cb,req,res,params)
    //                     }
    //                 }
    //             }
    //         }else{
    //             console.log("5) routes are not mathced now repeating the step 2")
    //             count++
    //         }
    //     }
    // }

    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const [routePath,middleware,callback] = Object.entries(route);
        let userDefinedRoute = routePath[1].charAt(0)==="/"?`api/v${options.apiVersion}/${routePath[1].substring(1)}`:routePath[1]
        const userDefinedMethod = routePath[0].toLowerCase();
        
        // checking if the requested url is static(defined in routes file)
        console.log("2) defined route[%s]: %s",i,userDefinedRoute)
        
        const userDefinedRouteSplited = userDefinedRoute.split("/");
        
        const getIfExistsInRoutes = () => {
            let result = {exist:false,route:{}}
            for (let k = 0; k < routes.length; k++) {
                const route = routes[k];
                const [testRoute,testMiddleware,testCallback] = Object.entries(route);
                const routePath = `api/v${options.apiVersion}${testRoute[1]}`
                if(checkRoutesEquality(routePath,requestedPathname) === true && testRoute[0].toLowerCase()===requestMethod){
                    result.route = route;
                    result.exist = true
                    k = routes.length
                    i = routes.length
                }                
            }
            return result;
        }

        const foundRoute = getIfExistsInRoutes()
        let params = {}
        if(foundRoute.exist){
            executeRoute(req,res,params,foundRoute.route)
        }else{
            if(userDefinedMethod===requestMethod && userDefinedRouteSplited.length===requestedPathnameSplited.length){
                console.log("2) method and length are same of requested and userdefined route")
                if(userDefinedRoute.indexOf(":")>-1){
                    console.log("3) userdefined route contains : that means it is dynamic")
                    const {routeParams,formatedUserDefinedRoute} = getUrlParamsAndFormatedDefinedUrlwithParamsValue(userDefinedRoute,requestedPathname);
                    userDefinedRoute = formatedUserDefinedRoute;
                    const routeEquality = checkRoutesEquality(userDefinedRoute,requestedPathname);
                    if(routeEquality===true){
                        console.log("4) now both routes are same so request terminating: ",userDefinedRoute,requestedPathname)
                        executeRoute(req,res,routeParams,route);
                        i=routes.length;
                    }else{
                        console.log("4) now both routes are not same so going to next iteration")
                        count++
                    }
                }else{
                    console.log("3) userdefined route doesn't contain : so it is static")
                    const routeEquality = checkRoutesEquality(userDefinedRoute,requestedPathname);
                    if(routeEquality===true){
                        console.log("4) userdefined route and requested route are same so now request terminating")
                        executeRoute(req,res,params,route);
                        i=routes.length;
                    }else{
                        console.log("4) userdefined route and requested route are not same so going to next iteration")
                        count++
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

module.exports = routeHandler

