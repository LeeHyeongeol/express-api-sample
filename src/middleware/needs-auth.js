const needsAuth = (req, res, next) => {
  if (!req.user) {
    res.sendStatus(401); // 유저 인증이 안됨
    return;
  }
  next();
};

module.exports = needsAuth;
