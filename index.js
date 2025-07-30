
import { app } from "./src/app.js";
import { PORT } from "./src/constants/constants.js";
import dbConnection from "./src/db/index.js";

const serverStart = async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`server is running http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(" ~ file: index.js:50 ~ serverStart ~ error:", error);
    process.exit(1);
  }
};

serverStart();

