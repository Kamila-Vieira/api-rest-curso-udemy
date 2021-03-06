const Aluno = require("../models/AlunoModel");

exports.index = async (req, res) => {
  try {
    const alunos = await Aluno.buscaAlunos();
    return res.status(200).json({ alunos });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message })
  }
};

exports.store = async (req, res) => {
  try {
    const aluno = new Aluno(req.body);
    await aluno.register();
    if (aluno.errors.length > 0) {
      return res.status(400).json({ errors: aluno.errors })
    }
    return res.status(200).json({ message: 'Aluno registrado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message })
  }
};

exports.show = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const aluno = await Aluno.buscaPorId(req.params.id);

  if (!aluno) return res.status(400).json({ error: 'Aluno não encontrado' })

  return res.status(200).json({ aluno });
};

exports.update = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: 'ID inválido' })
    const aluno = new Aluno(req.body);
    const alunoEdited = await aluno.edit(req.params.id);

    if (aluno.errors.length > 0) {
      return res.status(400).json({ errors: aluno.errors })
    }

    if (!alunoEdited) return res.status(400).json({ error: 'Aluno não encontrado' })

    return res.status(200).json({ message: 'Aluno alterado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};

exports.delete = async (req, res) => {
  try{
    if (!req.params.id) return res.status(400).json({ error: 'ID inválido' })
  
    const aluno = await Aluno.delete(req.params.id);
  
    if (!aluno) return res.status(400).json({ error: 'Aluno não encontrado' })
  
    return res.status(200).json({ message: 'Aluno deletado com sucesso' });

  }catch (error){
    return res.status(400).json({ error: error.message })
  }
};
