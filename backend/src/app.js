const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("SERVER IS RUNNING");
})

module.exports = app;