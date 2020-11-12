const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient(process.env.REDIS_URI);
const redisClientGet = promisify(redisClient.get).bind(redisClient);
const redisClientSet = promisify(redisClient.set).bind(redisClient);
const redisClientDel = promisify(redisClient.del).bind(redisClient);

module.exports = {
  redisClientGet,
  redisClientSet,
  redisClientDel,
};
