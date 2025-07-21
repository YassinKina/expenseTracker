// import { neon } from "@neondatabase/serverless";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default prisma;

// export const sql = neon(process.env.DATABASE_URL);
