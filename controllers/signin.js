const jwt = require("jsonwebtoken");
const fs = require("fs");

const redisClientGet = require("./redis").redisClientGet;
const redisClientSet = require("./redis").redisClientSet;

const privateKey = fs.readFileSync("./private.key", "utf-8");
const publicKey = fs.readFileSync("./public.key", "utf-8");

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject("incorrect form submission");
  }
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => user[0])
          .catch((err) => Promise.reject("Unable to get user"));
      } else {
        Promise.reject("wrong credentials");
      }
    })
    .catch((err) => Promise.reject("wrong credentials"));
};

const verifyToken = (req) => {
  const { authorization } = req.headers;

  return jwt.verify(
    authorization,
    publicKey,
    {
      maxAge: "24h",
      algorithms: "RS256",
    },
    async function (err, decoded) {
      if (err) {
        return { success: false };
      } else {
        return { success: true };
      }
    }
  );
};

const getAuthTokenId = (req) => {
  const { authorization } = req.headers;

  return redisClientGet(authorization)
    .then((id) => {
      if (id) return id;
      else return Promise.reject("No Reply");
    })
    .catch((err) => console.log("No Reply"));
};

const createSessions = (user) => {
  //JWT Token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: true, id, token };
    })
    .catch(console.log);
};

const setToken = (token, id) => {
  return Promise.resolve(redisClientSet(token, id));
};

const signToken = (email) => {
  const jwtPayload = { email };

  return jwt.sign(jwtPayload, privateKey, {
    expiresIn: "12h",
    algorithm: "RS256",
  });
  //return jwt.sign(jwtPayload, process.env.JWTSECRET, { expiresIn: "2 days" });
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req)
        .then((id) => {
          return verifyToken(req)
            .then(({ success }) => {
              if (success) {
                return res.json({ id });
              } else {
                return res.status(400).json("Unauthorized");
              }
            })
            .catch((error) => {
              return res.status(400).json("Unauthorized");
            });
        })
        .catch((err) => res.status(400).json("Unauthorized"))
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  signinAuthentication,
  verifyToken,
};
