import jwt from "jsonwebtoken";

export class AuthController {
  generateToken(req, res) {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: "apiKey é obrigatória" });
    }

    // A chave de API válida pode ser configurada via .env
    const validApiKey = process.env.API_KEY || "desafio-jitterbit";
    const jwtSecret = process.env.JWT_SECRET || "desafio-jitterbit";

    if (apiKey !== validApiKey) {
      return res.status(401).json({ error: "apiKey inválida" });
    }

    // Gera um token com duração de 1 hora
    const token = jwt.sign({ client: "desafio-jitterbit" }, jwtSecret, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  }
}
