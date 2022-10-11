import dotenv from "dotenv";
import { cleanEnv, str, num } from "envalid";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config();

export type Environment = {
  PORT: number;
  NETWORK: string;
};

export const environment = cleanEnv(process.env, {
  NETWORK: str({ choices: ["harmain", "mumbai", "polygon", "fuji"] }),
  PORT: num({ default: 8000 }),
});
