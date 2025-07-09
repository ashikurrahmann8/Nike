import "dotenv/config";
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV;
const WHITELIST = process.env.WHITELIST || ["http://localhost:5175"];
const MONGO_URI = process.env.MONGO_URI;
export { PORT, WHITELIST, MONGO_URI, NODE_ENV };
