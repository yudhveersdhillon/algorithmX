var express = require("express");
var route = express.Router();

var authCheck = require("../auth/jwtAuthorized");

const userController = require("../controller/userController");


// Admin CRUD

route.post("/user/register", userController.register);
route.post("/user/login", userController.login);

route.post("/task/create", authCheck, userController.taskCreate);
route.get("/task/list", authCheck, userController.getAllTasksByUser);
route.get("/task/list/:taskId", authCheck, userController.getPerTask);
route.put(
    "/task/update/:taskId",
    authCheck,
    userController.taskUpdate
);
route.delete("/task/delete/:taskId", userController.taskDelete);



module.exports = route;
