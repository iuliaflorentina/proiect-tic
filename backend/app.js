const express=require("express")
const db=require("./db")
require("dotenv").config()
const routes=require('./routes/index')
const app=express()
const port=8080

app.use(express.json())
app.use("/",routes)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
