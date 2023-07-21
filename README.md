# myexpress.js
myexpress.js is my won custom nodejs library like express.js, it is my practice project of nodejs learning.

## how to run
clone the project and run (to use there is no need to install any dependency)
```
npm start
```
## how to use
API documentation link [https://documenter.getpostman.com/view/16162640/2s946k7qum](visit)

#### step 1
```javascript
const myexpress = require("./lib/mypress");
myexpress.createServer(3000,{
    apiVersion:1
});
```
#### step 2
add a route to routes object with middleware(optional) and with a callback function which will get request and response object to get request object and send response.

```javascript
const routes = [{get:"/user/get/:id",middleware:[],fn:(req,res)=>{}}]
module.exports = routes;
```

