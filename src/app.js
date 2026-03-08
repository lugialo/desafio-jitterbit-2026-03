import express from "express";
import cors from "cors";
import "dotenv/config";
import Routes from "./routes/index.js";

class App {
  constructor() {
    this.app = express();
    this.port = parseInt(process.env.SERVER_PORT) || 3333;
    this.app.use(express.json());
    this.handleCors();
    this.initRoutes();
  }

  initRoutes() {
    const routes = new Routes();
    this.app.use(routes.orderRoutes);
  }

  handleCors() {
    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
      }),
    );
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor rodando na porta: ${this.port}`);
    });
  }
}

export default App;
