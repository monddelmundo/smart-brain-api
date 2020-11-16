const redis = require("redis");
const { promisify } = require("util");

let redisClient = null;

if (process.env.ENV === "production") {
  redisClient = redis.createClient(process.env.REDIS_URL);
} else {
  redisClient = redis.createClient(process.env.REDIS_URI);
}

const redisClientGet = promisify(redisClient.get).bind(redisClient);
const redisClientSet = promisify(redisClient.set).bind(redisClient);
const redisClientDel = promisify(redisClient.del).bind(redisClient);

module.exports = {
  redisClientGet,
  redisClientSet,
  redisClientDel,
};
