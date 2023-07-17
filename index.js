const myexpress = require("./lib/mypress");
const { router } = require("./lib/router");

myexpress.createServer(3000,{
    apiPrefix:true,
    apiVersion:1
});
