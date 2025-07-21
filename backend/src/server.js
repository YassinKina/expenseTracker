import express from "express";
import dotenv from "dotenv";
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

// app.get("/health-check", (req, res) => {
//   res.send("it's working nowwwww");
// });

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

startServer();
