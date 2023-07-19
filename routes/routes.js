const urlController = require("../controllers/UrlController");
const userController = require("../controllers/UserController");
const send = require("../lib/response");
const authMiddleware = require("../middlware/authMiddleware");
const sampleMiddleware = require("../middlware/sampleMiddleware");
const testMiddleware = require("../middlware/testMiddleware");


const userRoutes = [
    {get:"/user/get/all",middleware:[],fn:userController.getAllUser},
    {get:"/user/get/:id",middleware:[],fn:userController.getUserById},
    {delete:"/user/delete/:id",middleware:[],fn:userController.deleteUser},
    {post:"/user/add",middleware:[],fn:userController.registerUser},
]

const urlRoutes = [
    {get:"/",middleware:[testMiddleware,sampleMiddleware],fn:urlController.getAllUrl},
    {post:"/add",middleware:[],fn:urlController.addUrl},
]

const routes = [...userRoutes,...urlRoutes]

module.exports = routes;