import { Router } from "express";
import OrderController from "../controllers/order.controller.js";

class OrderRoutes {
  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/order", this.orderController.create);

    this.router.get("/order/list", this.orderController.list);

    this.router.get("/order/:id", this.orderController.get);

    this.router.put("/order/:id", this.orderController.update);
  }
}

export default new OrderRoutes().router;
