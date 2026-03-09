import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

class AuthRoutes {
  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/auth", this.authController.generateToken);
  }
}

export default new AuthRoutes().router;
