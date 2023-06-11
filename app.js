const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (res) => console.log("connected to DB", res),
  (err) => console.log("DB error", err)
);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
