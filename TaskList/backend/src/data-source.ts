import "reflect-metadata";
import { DataSource } from "typeorm";
import { Note } from "./notes/note.entity";
import { User } from "./users/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Error444",
  database: process.env.DB_NAME || "notes_app_nueva",
  entities: [Note, User],
  migrations: ["src/migrations/*.ts"],
  synchronize: false, 
});
