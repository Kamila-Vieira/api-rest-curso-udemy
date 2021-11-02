const mongoose = require("mongoose");
const validator = require("validator");

const AlunoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true, default: "" },
  email: { type: String, required: true, default: "" },
  idade: { type: Number, required: true },
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
  
    if (!this.body.name) this.errors.push("Nome é um campo obrigatório");
    if (!this.body.sobrenome) this.errors.push("Sobrenome é um campo obrigatório");
  
    if (this.body.name.length < 3 || this.body.name.length > 255) this.errors.push("Nome precisa ter entre 3 e 255 caracteres");
    if (this.body.sobrenome.length < 3 || this.body.sobrenome.length > 255) this.errors.push("Sobrenome precisa ter entre 3 e 255 caracteres");
  
    if (isNaN(this.body.idade)) this.errors.push("Idade precisa ser um número inteiro");
  
    if (isNaN(this.body.peso)) this.errors.push("Peso precisa ser um número inteiro ou de ponto flutuante");
    if (isNaN(this.body.altura)) this.errors.push("Altura precisa ser um número inteiro ou de ponto flutuante");
    
  }

  cleanUp () {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
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
