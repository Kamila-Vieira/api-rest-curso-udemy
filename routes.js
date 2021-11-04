const express = require("express");
const route = express.Router(); // faz o roteamento entre páginas, vrifica a rota e chama um controlador
const userController = require("./src/controllers/userController");
const alunoController = require("./src/controllers/alunoController");

const { loginRequired, isAdmin } = require("./src/middlewares/middleware");


//Rotas de logins
route.post("/register", userController.store);
route.post("/login", userController.login);
route.get("/logout", userController.logout);

//Rotas de usuário
route.get("/user/:id?", loginRequired, isAdmin, userController.index);
route.put("/user/:id?", loginRequired, isAdmin, userController.update);
route.delete("/user/:id?", loginRequired, isAdmin, userController.delete);

//Rotas de aluno
route.get("/", loginRequired, alunoController.index);
route.post("/", loginRequired, alunoController.store);
route.put("/:id", loginRequired, alunoController.update);
route.get("/:id", loginRequired, alunoController.show);
route.delete("/:id", loginRequired, alunoController.delete);

module.exports = route;
