import express from "express";
const app = express();
const port = 3000;
import * as z from "zod";
import bcrypt from "bcrypt";
const saltRounds = 10;
import User from "./DB/users.js";
import Tweet from "./DB/tweets.js";
import sequelize from "./DB/config.js";
import jwt from "jsonwebtoken";
import cors from "cors";

app.use(cors()); // Allow all origins by default

app.use(express.json());

const SignRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const TweetRequestSchema = z.object({
  content: z.string().min(1),
});

const HeaderSchema = z.object({
  authorization: z.string().min(1),
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
          uid: ValidUser.uid,
          name: ValidUser.name,
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

app.post("/add-tweet", async (req, res) => {
  const result = TweetRequestSchema.safeParse(req.body);
  const headerResult = HeaderSchema.safeParse(req.headers);
  if (!result.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  } else {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ err: "No token provided" });
    } else {
      console.log(token);
      jwt.verify(token, "Khaled", async (err, decoded) => {
        if (err) {
          return res.status(401).json({ err: "Invalid token" });
        }
        const newTweet = await Tweet.create({
          userid: decoded.uid,
          author: decoded.name,
          content: result.data.content,
        });
        res.status(200).json({
          id: newTweet.uid,
        });
      });
    }
  }
});

app.get("/get-user-data", async (req, res) => {
  const headerResult = HeaderSchema.safeParse(req.headers);
  if (!headerResult.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  } else {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ err: "No token provided" });
    } else {
      jwt.verify(token, "Khaled", async (err, decoded) => {
        if (err) {
          return res.status(401).json({ err: "Invalid token" });
        } else {
          const user = await User.findOne({ where: { uid: decoded.uid } });
          if (!user) {
            return res.status(404).json({ err: "User not found" });
          }
          res.status(200).json(user);
        }
      });
    }
  }
});

app.get("/get-tweets", async (req, res) => {
  const headerResult = HeaderSchema.safeParse(req.headers);
  if (!headerResult.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  } else {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ err: "No token provided" });
    } else {
      jwt.verify(token, "Khaled", async (err, decoded) => {
        if (err) {
          return res.status(401).json({ err: "Invalid token" });
        } else {
          const tweets = await Tweet.findAll();
          res.status(200).json(tweets);
        }
      });
    }
  }
});

app.delete("/delete-tweet/:id", async (req, res) => {
  const uid = req.params.id;
  try {
    const deleted = await Tweet.destroy({ where: { uid: uid } });
    if (deleted) {
      res.status(200).json({ message: "Tweet deleted successfully." });
    } else {
      res.status(404).json({ error: "Tweet not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting tweet." });
  }
});

app.patch("/edit-tweet/:id", async (req, res) => {
  const uid = req.params.id;
  const result = TweetRequestSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Schema error",
    });
  } else {
    try {
      const [updated] = await Tweet.update(
        { content: result.data.content },
        { where: { uid: uid } }
      );
      if (updated) {
        res.status(200).json({ message: "Tweet updated successfully." });
      } else {
        res.status(404).json({ error: "Tweet not found." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error while updating tweet." });
    }
  }
});

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
