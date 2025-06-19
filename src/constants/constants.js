import "dotenv/config";
const PORT = process.env.PORT || 8000;
const WHITELIST = process.env.WHITELIST || ["http://localhost:5175"];
const MONGO_URI = process.env.MONGO_URI;
export { PORT, WHITELIST, MONGO_URI };
