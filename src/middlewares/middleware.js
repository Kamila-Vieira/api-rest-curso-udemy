exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    return res.status(400).json({ error: 'Você precisa fazer login' })
  }
  next();
};
