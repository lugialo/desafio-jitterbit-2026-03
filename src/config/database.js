import mongoose from "mongoose";

const databaseUrl = process.env.MONGODB_URL?.toString();

export async function connectToDatabase() {
  if (!databaseUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables.");
  }

  try {
    await mongoose.connect(databaseUrl);
    console.log("Conexão ao MongoDB estabelecida com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
}
