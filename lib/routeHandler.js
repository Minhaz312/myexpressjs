const url = require("url")

const routes = require("../routes/routes");
const routeWrappingIgnore = require("./../config/routeWrappingIgnore")
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

    console.log("1) checking if route ignore the api/v1 prefix")
    const checkRouteIgnorePrefix = ()=>{
        // 1) check if the route is dynamic checking if contain :
        // 2) if dynamic then check the method and length of dynamic route and requested route
        // 3) if length and methods are same then get the route for dynamic route using requested route
        // 4) check now if they are same then return true else repeat steps from first
        // 5) if the result of step 1 is static route then check the route is exist in routeWrappingIgnore routes array
        // 6) if the route is not ignorring api/v1 wrapping then return false else return true 
        let itIgnore;
        for (let i = 0; i < routeWrappingIgnore.length; i++) {
            const r = routeWrappingIgnore[i];
            const [a,b,c] = Object.entries(r);
            const formatedRRoute = a[1]==="/"?a[1]:a[1].substring(1);// for / it is / and for /asdf it is asdf 
            const formatedRequestedRoute = parsedUrl.pathname==="/"?parsedUrl.pathname:parsedUrl.pathname.toString().substring(1) // for / it is / and for /asdf it is asdf
            if(formatedRRoute.indexOf(":")>=0 && a[0].toLowerCase()===requestMethod){
                const formatedRoute = getUrlParamsAndFormatedDefinedUrlwithParamsValue(formatedRRoute,formatedRequestedRoute);
                console.log("formatedRoute route now: ",formatedRoute)
                const routeAreEqual = checkRoutesEquality(formatedRoute.formatedUserDefinedRoute,formatedRequestedRoute);
                if(a[0].toLowerCase()===requestMethod && routeAreEqual===true){
                    i = routeWrappingIgnore.length;
                    itIgnore = true
                }else{
                    itIgnore = false
                }
            }else{
                const routeAreEqual = checkRoutesEquality(formatedRRoute,formatedRequestedRoute);
                if(a[0].toLowerCase()===requestMethod && routeAreEqual===true){
                    i = routeWrappingIgnore.length;
                    itIgnore = true
                }else{
                    itIgnore = false
                }
            }
            
        }
        return itIgnore;
    }
    const routeIgnorePrefix = checkRouteIgnorePrefix()
    console.log("val of routeIgnorePrefix: ",routeIgnorePrefix)
    if(requestedPathname.indexOf(`api/v${options.apiVersion}`)<0 && routeIgnorePrefix===true){
        console.log("2) yes route ignore the prefix api/v1.")
        
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const [r,m,f] = Object.entries(route);
            if(r[0].toLowerCase()===requestMethod && checkRoutesEquality(parsedUrl.pathname,r[1])===true){
                executeRoute(req,res,{},route)
                i=routes.length;
            }else{
                const {routeParams,formatedUserDefinedRoute} = getUrlParamsAndFormatedDefinedUrlwithParamsValue(r[1],parsedUrl.pathname);
                if(checkRoutesEquality(formatedUserDefinedRoute.substring(1),requestedPathname)){
                    i=routes.length;
                    executeRoute(req,res,routeParams,route)
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
    }else{
        console.log("1) requested route: ",requestedPathname)
    
    
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

    
}

module.exports = routeHandler

