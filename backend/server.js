import express from "express";
import dotenv from "dotenv";
// import { sql } from "./config/db.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5001; //this val would be undefined until dotenv.config();

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
//built in middleware- func that runs between req and response
//parses incoming json request bodies into req.body
app.use(express.json());

//Adds data to transactions table in db
app.post("/api/transactions", async (req, res) => {
  try {
    //title, amount, cat, user_id
    const { title, amount, category, user_id } = req.body;
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const transaction = await prisma.transaction.create({
      data: {
        user_id,
        title,
        amount,
        category,
      },
    });

    // const transaction = await sql`
    // INSERT INTO transactions(user_id,title,amount,category)
    // VALUES (${user_id},${title},${amount},${category})
    // RETURNING *
    // `;

    console.log(Object.values(transaction));
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating the transaction:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("it's working now");
});

//Get all transactions of a specific user
app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // const transactions = await sql`
    // SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    // `;
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transactions:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Delete a transaction by id from db
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const idInt = parseInt(id, 10);

    //If the id received cannot be converted to a number, error
    if (isNaN(idInt)) {
      console.log(idInt);
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const deletedTransacation = await prisma.transaction.delete({
      where: {
        id: idInt,
      },
    });
    // const result =
    //   await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *
    // `;

    if (deletedTransacation.length == 0) {
      return res.status(404).json({ message: "Transaction not found" });
      //error not found
    }

    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      // No record found to delete
      return res.status(404).json({ message: "Transaction not found" });
    }
    console.error("Error deleting the transactions:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

//Get summary of transactions per user id
app.get("/api/transactions/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balance = await prisma.transaction.aggregate({
      where: { user_id: userId },
      _sum: { amount: true },
    });
    const balanceResult = balance._sum.amount ?? 0;

    // const balanceResult = await sql`
    // SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    // `;

    const income = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        amount: { gt: 0 },
      },
      _sum: { amount: true },
    });

    const incomeResult = income._sum.amount ?? 0;

    // const incomeResult = await sql`
    // SELECT COALESCE(SUM(amount), 0) as income FROM transactions
    // WHERE user_id = ${userId} AND amount > 0
    // `;

    const expenses = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        amount: { lt: 0 },
      },
      _sum: { amount: true },
    });

    const expensesResult = expenses._sum.amount ?? 0;
    // const expensesResult = await sql`
    // SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
    // WHERE user_id = ${userId} AND amount < 0
    // `;

    res.status(200).json({
      balance: balanceResult,
      income: incomeResult,
      expenses: expensesResult,
    });
  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

startServer();

//429 is too many req

// initDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("Server is running on PORT: ", PORT);
//   });
// });
