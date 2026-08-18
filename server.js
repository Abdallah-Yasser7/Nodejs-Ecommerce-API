const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const ApiError = require("./utils/apiError");
dotenv.config({ path: "./config.env" });
const port = process.env.PORT || 3000;
const morgan = require("morgan");
const globalErrorMiddleware = require("./middlewares/errorMiddleware");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const dbConnection = require("./config/database");
// Connect to MongoDB
dbConnection();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set('query parser', 'extended');
// mount routes
const categoryRoute = require("./routes/categoryRoute");
app.use("/api/v1/categories", categoryRoute);

const subCategoryRoute = require("./routes/subCategoryRoute");
app.use("/api/v1/subcategories", subCategoryRoute);

const brandRoute = require("./routes/brandRoute");
app.use("/api/v1/brands", brandRoute);

const productRoute = require("./routes/productRoute");
app.use("/api/v1/products", productRoute);

// this is new in express version 5
app.all("/*any", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server!`, 400));
});

// global error handler middleware for express
app.use(globalErrorMiddleware);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Handle Rejection Outside Express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  // Close server & exit process
  server.close(() => {
    console.error("shutting down...");
    process.exit(1);
  });
});
