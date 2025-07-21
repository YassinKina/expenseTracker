import express from "express";
import dotenv from "dotenv";
// import { sql } from "./config/db.js";
import { PrismaClient } from "@prisma/client";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import prisma from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; //this val would be undefined until dotenv.config();

//MIDDLEWARE
//built in middleware- func that runs between req and response

app.use((req, res, next) => {
  const userId = req.headers["x-user-id"];
  if (userId) {
    req.userId = userId;
  }
  next();
});
//limits number of user requests
app.use(rateLimiter);
//parses incoming json request bodies into req.body
app.use(express.json());
//in the transactionroute.js file, we can write everything as  "/"
app.use("/api/transactions", transactionsRoute);
// app.use("api/products", productsRoute) -> productsRoute.js

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log("Server is running or PORT:", PORT);
    });
  } catch (error) {
    console.log("Error starting server", error);
  }
}

//No longer need this function, as prisma handles this
async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log("DB initialized successfully");
  } catch (error) {
    console.error("Error initializing db: ", error);
    process.exit(1); //status code 1 means failure, 0 means success
  }
}

startServer();

//status code 429 is too many req

// initDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("Server is running on PORT: ", PORT);
//   });
// });
