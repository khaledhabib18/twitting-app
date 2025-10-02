import express from "express";
const app = express();
const port = 3000;
import * as z from "zod";
import bcrypt from "bcrypt";
const saltRounds = 10;
import User from "./DB/users.js";
import sequelize from "./DB/config.js";
import jwt from "jsonwebtoken";
import cors from "cors";

app.use(cors()); // Allow all origins by default

app.use(express.json());

const SignRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

app.post("/sign-in-request", async (req, res) => {
  const result = SignRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  }
  const ValidUser = await User.findOne({ where: { email: req.body.email } });
  if (ValidUser) {
    const PasswordCorrect = await bcrypt.compare(
      req.body.password,
      ValidUser.password
    );
    if (PasswordCorrect) {
      const token = jwt.sign(
        {
          id: ValidUser.id,
          email: ValidUser.email,
          password: ValidUser.password,
        },
        "Khaled"
      );
      res.status(200).json({ token });
    } else {
      res.status(400).json({
        err: "Password or Username is incorrect",
      });
    }
  } else {
    res.status(400).json({
      err: "Password or Username is incorrect",
    });
  }

  //   res.send(req.body);
});
app.post("/sign-up-request", async (req, res) => {
  const result = SignRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  }
  const unique_email = await User.findOne({ where: { email: req.body.email } });
  if (unique_email) {
    return res.status(400).json({ err: "Email is used by another user" });
  } else {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
        res.status(500).json({ err: "Error hashing the password" });
      } else {
        const newUser = User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });
        res.status(200).json({
          token: hash,
        });
      }
    });
  }
});
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
