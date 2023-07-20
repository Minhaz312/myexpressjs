const urlController = require("../controllers/UrlController");
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlware/authMiddleware");

// RULES: {method:"urlendpoint",middleware:[middlewareList],fn:callbackFunction}

const userRoutes = [
    {get:"/user/get/:id",middleware:[],fn:userController.getUserById},
    {get:"/user/get/all",middleware:[],fn:userController.getAllUser},
    {delete:"/user/delete/:id",middleware:[],fn:userController.deleteUser},
    {post:"/user/add",middleware:[],fn:userController.registerUser},
    {put:"/user/update",middleware:[],fn:userController.userUpdate},
]

const urlRoutes = [
    {get:"/",middleware:[authMiddleware],fn:urlController.getAllUrl},
    {post:"/add",middleware:[authMiddleware],fn:urlController.addUrl},
    {get:"/get/all",middleware:[authMiddleware],fn:urlController.getAllUrl},
    {get:"/get/:id",middleware:[authMiddleware],fn:urlController.getUrlById},
    {delete:"/delete/:id",middleware:[authMiddleware],fn:urlController.deleteUrl},
    {put:"/udpate",middleware:[authMiddleware],fn:urlController.updateUrl},
]

// this file must export routes array

const routes = [...userRoutes,...urlRoutes]

module.exports = routes;