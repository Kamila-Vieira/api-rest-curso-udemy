const User = require("../models/UserModel");

exports.index = async (req, res) => {
  try {
    const users = await User.buscaUsuarios();
    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error })
  }
};

exports.register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.register();

    if (aluno.errors.length > 0) {
      return res.status(400).json({ errors: aluno.errors })
    }
    return res.status(200).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error })
  }
};

exports.login = async (req, res) => {
  try {
    const login = new User(req.body);
    await login.login();

    if (login.errors.length > 0) {
      return res.status(400).json({ errors: login.errors })
    }

    req.session.user = login.user;
    return res.status(200).json({ message: 'Você entrou no sistema' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error })
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
};
