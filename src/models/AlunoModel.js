const mongoose = require("mongoose");
const validator = require("validator");

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: true, default: "" },
  idade: { type: Number, required: false },
  peso: { type: Number, required: false },
  altura: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});

const AlunoModel = mongoose.model("Aluno", AlunoSchema);

class Aluno {
  constructor(body){
    this.body = body;
    this.errors = [];
    this.aluno = null;
  }

  async register () {
    this.valida();
  
    if (this.errors.length > 0) return;
    this.aluno = await AlunoModel.create(this.body);
  }

  valida () {
    this.cleanUp();
  
    if (this.body.email && !validator.isEmail(this.body.email))
      this.errors.push("E-mail inválido");
  
    if (!this.body.nome) this.errors.push("Nome é um campo obrigatório");
    if (!this.body.sobrenome) this.errors.push("Sobrenome é um campo obrigatório");
  
    if (this.body.nome.length < 3 || this.body.nome.length > 255) this.errors.push("Nome precisa ter entre 3 e 255 caracteres");
    if (this.body.sobrenome.length < 3 || this.body.sobrenome.length > 255) this.errors.push("Sobrenome precisa ter entre 3 e 255 caracteres");
  
    if (typeof this.body.idade !== "number") this.errors.push("Idade precisa ser um número inteiro");
  
    if (typeof this.body.peso !== "number") this.errors.push("Peso precisa ser um número inteiro ou de ponto flutuante");
    if (typeof this.body.altura !== "number") this.errors.push("Altura precisa ser um número inteiro ou de ponto flutuante");
    
  }

  cleanUp () {
    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      idade: this.body.idade,
      peso: this.body.peso,
      altura: this.body.altura,
    };
  }

  async edit(id) {
    if (typeof id !== "string") return;
    this.valida();
    if (this.errors.length > 0) return;
    this.aluno = await AlunoModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
    return this.aluno;
  }
}

//Métodos estáticos

Aluno.buscaPorId = async function (id) {
  if (typeof id !== "string") return;

  const aluno = await AlunoModel.findById(id);
  return aluno;
};

Aluno.buscaAlunos = async function () {
  const alunos = await AlunoModel.find().sort({ createdAt: -1 });
  return alunos;
};

Aluno.delete = async function (id) {
  if (typeof id !== "string") return;

  const aluno = await AlunoModel.findOneAndDelete({ _id: id });
  return aluno;
};

module.exports = Aluno;
