# TinyUrl project
This api is built to short a long url.

## how to run
clone the project and run (to use there is no need to install any dependency)
```
npm start
```
## how to use
API documentation link [https://documenter.getpostman.com/view/16162640/2s946k7qum](visit)

#### step 1
```javascript
const app = require("./lib/mypress");
app.createServer(3000,{
    apiVersion:1
});
```
#### step 2
add a route to routes object with middleware(optional) and with a callback function which will get request and response object to get request object and send response.

```javascript
const routes = [{get:"/user/get/:id",middleware:[],fn:(req,res)=>{}}]
module.exports = routes;
```

