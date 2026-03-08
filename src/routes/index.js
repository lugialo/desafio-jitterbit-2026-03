import { Router } from "express";
import orderRoutes from "./order.routes.js";

class Routes {
  constructor() {
    this.orderRoutes = orderRoutes;
  }
}

export default Routes;
