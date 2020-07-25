const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The Server has Started on PORT: ${PORT}`));

mongoose.connect(
  process.env.MONGODB_CONNCETION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  },
  (err) => {
    if (err) throw err;

    console.log("MongoDB Connection established");
  }
);

app.use("/users", require("./routes/userRouter"));
