# React Native Wallet

A full-stack wallet application with a Node.js/Express backend and a React Native (Expo) mobile frontend. The app allows users to track their income and expenses, view transaction summaries, and manage their finances on the go.

---

## Project Structure

```
backend/    # Node.js/Express API with Prisma ORM
mobile/     # React Native (Expo) mobile app
```

---

## Backend

### Features

- RESTful API for transactions
- User authentication (via Clerk, using `x-user-id` header)
- Rate limiting middleware
- Prisma ORM for database access
- Scheduled jobs (cron)
- Health check endpoint

### Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values.

3. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   The server will run on the port specified in `.env` or default to `5001`.

---

## Mobile (Frontend)

### Features

- User authentication with Clerk
- View balance, income, and expenses
- Add, delete, and refresh transactions
- Modern UI with custom styles
- File-based routing with Expo Router

### Setup

1. **Install dependencies**

   ```bash
   cd mobile
   npm install
   ```

2. **Start the Expo app**

   ```bash
   npx expo start
   ```

   You can open the app in an emulator, simulator, or on your device using Expo Go.

3. **Environment Variables**

   Configure your `.env` file in the `mobile` directory as needed (e.g., API base URL).

---

## Development Notes

- The backend expects an `x-user-id` header for authenticated requests.
- The mobile app uses hooks like `useTransactions` and components like `BalanceCard` and `TransactionItem` for UI and data management.
- Styling is managed via the `assets/styles` directory in the mobile app.

---

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Prisma documentation](https://www.prisma.io/docs/)
- [Express documentation](https://expressjs.com/)

---

## License

MIT
