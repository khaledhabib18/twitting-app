// app.js
const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const sequelize = require("./models/config");
port = 3000;

app.use(cors()); // Allow all origins by default
app.use(express.json());
app.use("/", userRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
