const express = require("express")
const db = require("./db")
require("dotenv").config()
const routes = require('./routes/index')
const app = express()
const port = 8080

app.use((req, res, next) => {
  if (req.originalUrl === '/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/", routes)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
