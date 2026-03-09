import { Router } from "express";
import OrderController from "../controllers/order.controller.js";
import { AuthMiddleware } from "../middlewares/authentication/auth.js";

class OrderRoutes {
  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/order", AuthMiddleware.verify, this.orderController.create);

    this.router.get("/order/list", AuthMiddleware.verify, this.orderController.list);

    this.router.get("/order/:id", AuthMiddleware.verify, this.orderController.get);

    this.router.put("/order/:id", AuthMiddleware.verify, this.orderController.update);

    this.router.delete("/order/:id", AuthMiddleware.verify, this.orderController.delete);
  }
}

export default new OrderRoutes().router;
