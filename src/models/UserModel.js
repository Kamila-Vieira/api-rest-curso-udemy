const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false, default: "" },
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
});

const UserModel = mongoose.model("User", UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;

    this.user = await UserModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push("Usuário não existe");
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push("Senha inválida");
      this.user = null;
      return;
    }

    return this.user.admin;
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await UserModel.create(this.body);
  }

  valida() {
    this.cleanUp();

    if (!validator.isEmail(this.body.email))
      this.errors.push("E-mail inválido");

    if (this.body.password.length < 4 || this.body.password.length >= 50)
      this.errors.push("A senha precisa ter entre 4 e 50 caracteres");
  }

  cleanUp() {
    this.body = {
      name: this.body.name,
      email: this.body.email,
      password: this.body.password,
      admin: this.body.admin,
    };
  }

  async userExists() {
    this.user = await UserModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push("Usuário já existe");
  }
  
  async edit(id) {
    if (typeof id !== "string") return;
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await UserModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }
}

//Métodos estáticos

User.buscaPorId = async function (id) {
  if (typeof id !== "string") return;

  const usuario = await UserModel.findById(id);
  return usuario;
};

User.buscaUsuarios= async function () {
  const usuarios = await UserModel.find().sort({ createdAt: -1 });
  return usuarios;
};

User.delete = async function (id) {
  if (typeof id !== "string") return;

  const usuario = await UserModel.findOneAndDelete({ _id: id });
  return usuario;
};

module.exports = User;
