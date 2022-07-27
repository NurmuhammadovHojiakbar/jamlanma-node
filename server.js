const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION. SERVER SHUTTING DOWN...");
  console.log(`${err.name}: ${err.message}`);

  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB =
  process.env.DATABASE?.replace("<PASSWORD>", process.env.DATABASE_PASSWORD) ||
  process.env.DATABASE_LOCAL;

const port = process.env.PORT || 5000;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB ga ulanish amalga oshdi...");
  })
  .catch((err) => {
    console.log("DB ga ulanish amalga oshmadi: ", err);
  });

const server = app.listen(port, () =>
  console.log(`Dastur ${port} portda ishga tushdi...`)
);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION. SERVER SHUTTING DOWN...");
  console.log(`${err.name}: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});
