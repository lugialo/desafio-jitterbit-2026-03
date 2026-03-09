import jwt from "jsonwebtoken";

export class AuthMiddleware {
  static verify(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Token de autenticação não fornecido." });
    }

    const [, token] = authHeader.split(" ");

    try {
      const jwtSecret = process.env.JWT_SECRET || "desafio-jitterbit";

      // Valida a assinatura e a expiração do token
      jwt.verify(token, jwtSecret);

      return next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }
  }
}
