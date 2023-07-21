const urlController = require("../controllers/UrlController");
const userController = require("../controllers/UserController");
const authMiddleware = require("../middlware/authMiddleware");

// RULES: {method:"urlendpoint",middleware:[middlewareList],fn:callbackFunction}

const userRoutes = [
    {get:"/user/get/:id",middleware:[authMiddleware],fn:userController.getUserById},
    {get:"/user/get/all",middleware:[authMiddleware],fn:userController.getAllUser},
    {delete:"/user/delete/:id",middleware:[authMiddleware],fn:userController.deleteUser},
    {post:"/user/add",middleware:[authMiddleware],fn:userController.registerUser},
    {put:"/user/update",middleware:[authMiddleware],fn:userController.userUpdate},
    {post:"/user/login",middleware:[],fn:userController.loginUser},
]

const urlRoutes = [
    {get:"/:tiny",middleware:[],fn:urlController.redirectUrl},
    {post:"/url/add",middleware:[authMiddleware],fn:urlController.addUrl},
    {get:"/url/get/all",middleware:[authMiddleware],fn:urlController.getAllUrl},
    {get:"/url/get/:id",middleware:[authMiddleware],fn:urlController.getUrlById},
    {delete:"/url/delete/:id",middleware:[authMiddleware],fn:urlController.deleteUrl},
    {put:"/url/udpate",middleware:[authMiddleware],fn:urlController.updateUrl},
]

// this file must export routes array

const routes = [...userRoutes,...urlRoutes]

module.exports = routes;