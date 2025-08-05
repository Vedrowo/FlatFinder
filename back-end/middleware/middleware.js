const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

const requireRole = (role) => (req, res, next) => {
  if (req.session.user && req.session.user.role === role) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
};

module.exports = {
  isAuthenticated,
  requireRole
};
