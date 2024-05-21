import express from "express";

const app = express();

export const helloWorld = app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  });
});
