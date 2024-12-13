# TheGrayStars Backend

This is the backend server for TheGrayStars project, built with Express.js and TypeScript.

## Technologies Used

- Node.js
- Express.js
- TypeScript
- MySQL
- CORS
- dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL database

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Starts the production server
- `npm run dev` - Starts the development server with hot-reload
- `npm run build` - Builds the TypeScript code
- `npm run migrate` - Runs database migrations

## Project Structure

```
src/
├── index.ts          # Application entry point
├── database/         # Database configurations and migrations
├── routes/          # API routes
└── controllers/     # Route controllers
```

## API Documentation

[Add API endpoints documentation here]

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```
