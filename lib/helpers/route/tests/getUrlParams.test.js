const getUrlParams = require("../getUrlParams");

test('checking if it gives the url params', () => { 
    expect(getUrlParams("api/v1/user/get/:id","api/v1/user/get/3")).toEqual({routeParams:{id:"3"},formatedUserDefinedRoute:"api/v1/user/get/3"})
 })