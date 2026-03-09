import orderRoutes from "./order.routes.js";
import authRoutes from "./auth.routes.js";

class Routes {
  // Centraliza as rotas de autenticação e pedidos
  constructor() {
    this.authRoutes = authRoutes;
    this.orderRoutes = orderRoutes;
  }
}

export default Routes;
