import dotenv from "dotenv"
import { __dirname, pathJoin } from "../utils/utils.js";


dotenv.config({ path: pathJoin(__dirname, ".env" )});

export const {
  MDB_USER,
  MDB_PASS,
  MDB_HOST,
  DATABASE_NAME,
  PORT,
  PROD_ENDPOINT,
  GH_SESSION_SECRET,
  GH_CLIENT_ID,
  PERSISTENCE
} = process.env;