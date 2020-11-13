const redisClientGet = require("./redis").redisClientGet;
const verifyToken = require("./signin").verifyToken;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json("Unauthorized");

  return redisClientGet(authorization)
    .then((id) => {
      if (!id) return res.status(401).json("Unauthorized");
      return verifyToken(req)
        .then(({ success }) => {
          if (success) {
            return next();
          } else {
            return res.status(401).json("Unauthorized");
          }
        })
        .catch((error) => {
          return res.status(401).json("Unauthorized");
        });
    })
    .catch((err) => console.log("No Reply"));
};

module.exports = {
  requireAuth,
};
