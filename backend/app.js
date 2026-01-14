const express=require("express")
const db=require("./db")
const app=express()
const port=8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

const users =db.collection('users')