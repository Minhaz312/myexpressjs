const checkRoutesEquality = require("../checkRoutesEquality")

test('checking two pathname are same or not', () => { 
    expect(checkRoutesEquality("api/v1/user/get/all","api/v1/user/get/all")).toBe(true)
    expect(checkRoutesEquality("api/v1/user/get/all","api/v1/user/get/:id")).toBe(false)
    expect(checkRoutesEquality("/","/")).toBe(true)
    expect(checkRoutesEquality("param","param")).toBe(true)
 })