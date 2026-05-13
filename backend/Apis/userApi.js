import { UserModel } from '../models/UserModel.js';
import express from "express";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRoute = express.Router();

// REGISTER USER
userRoute.post("/user", async (req, res) => {
  try {
    let user = req.body;
    user.password = await hash(user.password, 12);
    let newUser = new UserModel(user);
    await newUser.save();
    res.status(201).json({ message: "user created" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// LOGIN USER
userRoute.post("/login", async (req, res) => {
  try {
    let cred = req.body;
    let user = await UserModel.findOne({ email: cred.email });
    if (!user) return res.status(404).json({ message: "Invalid email" });

    let isMatch = await compare(cred.password, user.password);
    if (!isMatch) return res.status(404).json({ message: "Invalid password" });

    let token = jwt.sign({ email: user.email }, "abcdef", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
    res.status(200).json({ message: "login success", payload: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// LOGOUT USER
userRoute.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout success" });
});

// ADD NEW TODO
userRoute.put("/todo/:userid", async (req, res) => {
  let uid = req.params.userid;
  let newTask = req.body;
  let updatedUser = await UserModel.findByIdAndUpdate(
    uid,
    { $push: { todos: newTask } },
    { new: true }
  );
  res.status(200).json({ message: "todo added", payload: updatedUser });
});

// DELETE TODO
userRoute.put("/delete-todo/:userid/:taskid", async (req, res) => {
  let { userid, taskid } = req.params;
  let updatedUser = await UserModel.findByIdAndUpdate(
    userid,
    { $pull: { todos: { _id: taskid } } },
    { new: true }
  );
  res.status(200).json({ message: "task deleted", payload: updatedUser });
});

// MARK AS COMPLETED
userRoute.put("/edit-status/:userid/:taskid", async (req, res) => {
  let { userid, taskid } = req.params;
  let updatedUser = await UserModel.findOneAndUpdate(
    { _id: userid, "todos._id": taskid },
    { $set: { "todos.$.status": "completed" } },
    { new: true }
  );
  res.status(200).json({ message: "task updated", payload: updatedUser });
});

// EDIT TASK
userRoute.put("/edit-todo/:userid/:taskid", async (req, res) => {
  try {
    const { userid, taskid } = req.params;
    const updatedTask = req.body;

    let updatedUser = await UserModel.findOneAndUpdate(
      { _id: userid, "todos._id": taskid },
      {
        $set: {
          "todos.$.taskName": updatedTask.taskName,
          "todos.$.description": updatedTask.description,
        },
      },
      { new: true }
    );

    res.status(200).json({ message: "task updated", payload: updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
