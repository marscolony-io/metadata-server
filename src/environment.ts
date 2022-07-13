import dotenv from "dotenv";
import { cleanEnv, str, num, bool, url } from "envalid";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config();

export type Environment = {
  PORT: number;
  NETWORK: string;
};

export const environment = cleanEnv(process.env, {
  NETWORK: str({ desc: "Name ot the network, e.g. hartest" }),
  PORT: num({ default: 8000 }),
});
