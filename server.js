const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectToDb = require("./config/db");
const userRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRouter");
const path = require("path");
// dotenv config
dotenv.config();

// config db
connectToDb();
const port = process.env.PORT;

// rest object
const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// get route
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// static files

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log(`server is listining to the port ${port}`);
});
