const getActualPathname = require("../getActualPathname")

test('get actual pathname for a dynamic userdefined route', () => { 
    expect(getActualPathname("api/v1/user/get/:id")).toStrictEqual({params:[{id:4}],splitedPath:["api","v1","user","get",":id"]})
 })