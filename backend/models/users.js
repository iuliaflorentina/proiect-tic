
const db=require("../db")
const usersCollection= db.collection('users')

const findUsers = async () => {
  const snapshot = await usersCollection.get()

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

const findById = async (id) =>{
    return await usersCollection.doc(id).get()

}

const addUser=async (newUser)=>{
    const docRef = await usersCollection.add(newUser)
    return { id: docRef.id, ...newUser }
}

const deleteUser= async(id)=>{
    await usersCollection.doc(id).delete()
    return { message: "User deleted successfully"}

}

const updateUser = async (id, userUpdated) => {
  const snapshot = usersCollection.doc(id)
  const doc = await snapshot.get()

  if (!doc.exists) {
    throw new Error("User not found")
  }

  await snapshot.update({
    ...userUpdated,
  })

  return { id, ...doc.data(), ...userUpdated }
}

const getBoughtTicketsByUser= async (id)=>{
    const snapshot = usersCollection.doc(id)
    const doc = await snapshot.get()

    if (!doc.exists) {
        throw new Error("User not found")
    }

    return doc.data().boughtTickets
}

const getExistingUserEmail=async(email)=>{
    const docUser=await usersCollection.where('email',"==",email).get()
    const doc=docUser.docs[0]
    const user={
      id: doc.id,
      ...doc.data()
    }
    return user
}

module.exports= {
    findUsers,
    findById,
    addUser,
    deleteUser,
    updateUser,
    getBoughtTicketsByUser,
    getExistingUserEmail
}