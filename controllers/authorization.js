const redisClientGet = require("./redis").redisClientGet;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json("Unauthorized");

  return redisClientGet(authorization)
    .then((id) => {
      if (!id) return res.status(401).json("Unauthorized");
      return next();
    })
    .catch((err) => console.log("No Reply"));
};

module.exports = {
  requireAuth,
};
