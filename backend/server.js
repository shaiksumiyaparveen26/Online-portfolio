import cookieParser from "cookie-parser";
import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import { userRoute } from "./Apis/userApi.js";
import { verifytoken } from "./verifytoken.js";
import { UserModel } from "./models/UserModel.js";

const app = express();

// CORS setup for cookies
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Login, Register routes
app.use("/user-api", userRoute);

async function connectDBAndStartServer() {
  try {
    await connect("mongodb://localhost:27017/pvptododb");
    console.log("DB connection successful");

    app.listen(8000, () =>
      console.log("Server is listening on port 8000")
    );
  } catch (err) {
    console.log("Error in database connection:", err);
  }
}

connectDBAndStartServer();

// Auto Login / Refresh Route
app.get("/refresh", verifytoken, async (req, res) => {
  console.log("Decoded user:", req.user);

  const userObj = await UserModel.findOne({ email: req.user.email });

  res.status(200).json({
    message: "user",
    payload: userObj,
  });
});
