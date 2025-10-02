import express from "express";
const app = express();
const port = 3000;
import * as z from "zod";
import bcrypt from "bcrypt";
const saltRounds = 10;
import User from "./DB/users.js";
import sequelize from "./DB/config.js";
app.use(express.json());

const SignUpRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

app.post("/sign-up-request", async (req, res) => {
  const result = SignUpRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  }
  const unique_email = await User.findOne({ where: { email: req.body.email } });
  if (unique_email) {
    return res.send("Email is used by another user");
  } else {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        res.send("Error hashing the password");
      } else {
        const newUser = User.create({
          email: req.body.email,
          password: hash,
        });
        res.send(hash);
      }
    });
  }
});
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
