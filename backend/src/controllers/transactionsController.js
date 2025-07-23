import prisma from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  //Get all transactions of a specific user

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

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting the transactions:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function createTransaction(req, res) {
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

    console.log(Object.values(transaction));
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating the transaction:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

export async function deleteTransaction(req, res) {
  //Delete a transaction by id from db

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
}

export async function getUserTransactionSummary(req, res) {
  //Get summary of transactions per user id

  try {
    const { userId } = req.params;

    const balance = await prisma.transaction.aggregate({
      where: { user_id: userId },
      _sum: { amount: true },
    });
    const balanceResult = balance._sum.amount ?? 0;

    const income = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        amount: { gt: 0 },
      },
      _sum: { amount: true },
    });
    const incomeResult = income._sum.amount ?? 0;

    const expenses = await prisma.transaction.aggregate({
      where: {
        user_id: userId,
        amount: { lt: 0 },
      },
      _sum: { amount: true },
    });
    const expensesResult = expenses._sum.amount ?? 0;

    res.status(200).json({
      balance: balanceResult,
      income: incomeResult,
      expenses: expensesResult,
    });
  } catch (error) {
    console.error("Error getting the summary:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}
