const express = require("express");
const route = express.Router(); // faz o roteamento entre páginas, vrifica a rota e chama um controlador
const homeController = require("./src/controllers/homeController");
const userController = require("./src/controllers/userController");
const alunoController = require("./src/controllers/alunoController");

const { loginRequired } = require("./src/middlewares/middleware");

//Rotas da home
route.get("/", homeController.index);

//Rotas de login
route.get("/user", loginRequired, userController.index);
route.post("/user/register", userController.register);
route.post("/user/login", userController.login);
route.get("/logout", userController.logout);

//Rotas de aluno
route.get("/aluno", loginRequired, alunoController.index);
route.post("/aluno/register", loginRequired, alunoController.register);
route.get("/aluno/:id", loginRequired, alunoController.editIndex);
route.post("/aluno/edit/:id", loginRequired, alunoController.edit);
route.get("/aluno/delete/:id", loginRequired, alunoController.delete);

module.exports = route;
