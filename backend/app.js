const express=require("express")
const db=require("./db")
const usersCollection=require("./models/users")
const app=express()
const port=8080

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

async function test() {
  const users = await usersCollection.findUsers()
  console.log(users)
}

test()