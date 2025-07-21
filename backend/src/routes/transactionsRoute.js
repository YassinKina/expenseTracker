import express from "express";
import {
  createTransaction,
  getTransactionsByUserId,
  getUserTransactionSummary,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

//Adds data to transactions table in db
router.post("/", createTransaction);
router.get("/summary/:userId", getUserTransactionSummary);
router.get("/:userId", getTransactionsByUserId);
router.delete("/:id", deleteTransaction);

export default router;
