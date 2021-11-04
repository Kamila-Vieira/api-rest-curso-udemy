const User = require("../models/UserModel");

exports.index = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: 'ID inválido' })
    const user = await User.buscaPorId(req.params.id);

    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' })

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message })
  }
};

exports.store = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.register();

    if (user.errors.length > 0) {
      return res.status(400).json({ errors: user.errors })
    }
    return res.status(200).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message })
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.params.id) return res.status(400).json({ error: 'ID inválido' })
    const user = new User(req.body);
    await user.edit(req.params.id);

    if (user.errors.length > 0) {
      return res.status(400).json({ errors: user.errors })
    }

    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' })

    return res.status(200).json({ message: 'Usuário alterado com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};

exports.delete = async (req, res) => {
  try{
    if (!req.params.id) return res.status(400).json({ error: 'ID inválido' })
  
    const user = await User.delete(req.params.id);
  
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' })
  
    return res.status(200).json({ message: 'Usuário deletado com sucesso' });

  }catch (error){
    return res.status(400).json({ error: error.message })
  }
};

exports.login = async (req, res) => {
  try {
    const user = new User(req.body);
    const isAdmin = await user.login();

    if (user.errors.length > 0) {
      return res.status(400).json({ errors: user.errors })
    }

    req.session.user = user.user;
    req.session.admin = isAdmin;
    req.session.save(function () {
      return res.redirect("back");
    });
    return res.status(200).json({ message: 'Você entrou no sistema' });
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};

exports.logout = (req, res) => {
  try {
    req.session.destroy();
    return res.status(200).json({ message: 'Você saiu do sistema' });
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
};
