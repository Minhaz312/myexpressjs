const getActualPathname = require("./getActualPathname");

const getUrlParams = (userDefinedRoute,requestedPathname,userDefinedMethod) => {
    let routeParams = {}
    let paramsCheck = getActualPathname(userDefinedRoute,userDefinedMethod.toLowerCase())
    let formatedUserDefinedRoute = userDefinedRoute
    let requestedPathnameSplited = requestedPathname.split("/")
    let userDefinedRouteSplited = userDefinedRoute.split("/")

    paramsCheck.params.map((item,i)=>{
        const paramKeyVal = Object.entries(item)[0]
        const paramName = paramKeyVal[0]
        const paramVal = paramKeyVal[1]
        routeParams[paramName] = requestedPathnameSplited[paramVal]
        userDefinedRouteSplited[paramVal] = requestedPathnameSplited[paramVal]
    })
    formatedUserDefinedRoute = userDefinedRouteSplited.join("/")
    return {routeParams,formatedUserDefinedRoute}
}

module.exports = getUrlParams