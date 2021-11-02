const Aluno = require("../models/AlunoModel");

exports.index = async (req, res) => {
  try {
    const alunos = await Aluno.buscaContatos();
    return res.status(200).json({ alunos });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error })
  }
};
