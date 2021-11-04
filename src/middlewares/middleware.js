exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    return res.status(400).json({ error: 'Você precisa fazer login' })
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(400).json({ error: 'Somente o administrador pode realizar esta operação.' })
  }
  next();
};
