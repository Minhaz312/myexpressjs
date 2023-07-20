const getActualPathname = require("./getActualPathname");


// this getUrlParams method returns the passed params value in requested url and modify the user defined (in routes file) dynamic route with the passed params value through requested url. For example 

// if userdefinedRoute = api/v1/user/get/:id and requestedPathname=api/v1/user/get/3 then this function converts the userdefinedRoute to api/v1/user/get/3 just replacing the value of :id=3; and also this function returns the params value to pass the value through the req.params;

const getUrlParams = (userDefinedRoute,requestedPathname) => {
    let routeParams = {}
    let paramsCheck = getActualPathname(userDefinedRoute)
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