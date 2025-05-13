import app from "./app";
import { initializeDatabase, sequelize } from "./config/database"; // database connection

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Connect DB
    await sequelize.authenticate();
    await initializeDatabase();
    console.log("Database connection established.");

    // Optionally sync schema
    // await sequelize.sync();

    // Start server
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
