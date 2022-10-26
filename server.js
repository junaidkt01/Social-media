const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGOURL } = require("./keyValues");
// const User = require("./models/User");
// const Post = require("./models/Post");
const app = express();

// mongoose
//   .connect("mongodb://127.0.0.1:27017/users", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to the DB");
//   })
//   .catch((err) => {
//     console.log("error");
//   });

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("mongoDB connected");
});
mongoose.connection.on("error", () => {
  console.log("mongoDB connection error");
});

app.use(express.json());
app.use(cors());

app.use(require("./routes/authRouter"));
app.use(require("./routes/postRouter"));
app.use(require("./routes/usersRouter"));

app.listen(3002, () => {
  console.log("backend server is running port 3002");
});
