const redisClientDel = require("./redis").redisClientDel;

const signout = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json("Unauthorized");

  return redisClientDel(authorization)
    .then((resp) => {
      console.log(resp);
      return res.json("Signed out successfully");
    })
    .catch((err) => res.status(401).json("Unauthorized"));
};

module.exports = {
  signout,
};
