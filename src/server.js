import App from "./app.js";
import { connectToDatabase } from "./config/database.js";

const app = new App();

app.listen();
connectToDatabase();
