const { findById, addUser, deleteUser, updateUser, getExistingUserEmail } = require('../models/users')
const bcrypt = require("bcryptjs")


const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await findById(id)

        if (!user.exists) {
            return res.status(404).send("User not found")
        }

        res.status(200).json({
            id: user.id,
            ...user.data()
        })
    } catch (err) {
        res.status(500).send("Failed to get user")
    }

}

const register = async (req, res) => {
    try {
        const { email, password, name, role, organizationName } = req.body
        const existingUser = await getExistingUserEmail(email)
        if (!existingUser.empty) {
            return res.status(409).json({ error: "User with this email already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = {
            email,
            name,
            role,
            password: hashedPassword,
            boughtTickets: []
        }
        if (role == 'organizer') {
            newUser.organizationName = organizationName
        }

        const createdUser = await addUser(newUser);
        res.status(201).json({
            user: createdUser,
        })
    } catch (err) {
        res.status(500).send("Failed to create user")
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const message = await deleteUser(id)
        res.status(200).json(message)
    } catch (error) {
        console.error(error)
        res.status(404).json({ message: error.message })
    }
}

const updateUserData = async (req, res) => {
    try {
        const { id } = req.params
        const userUpdated = req.body

        const updatedUser = await updateUser(id, userUpdated)
        res.status(200).json(updatedUser)
    } catch (error) {
        console.error(error)
        res.status(404).json({ message: error.message })
    }
}

const getBoughtTicketsByUserController = async (req, res) => {
    try {
        const { id } = req.params
        const tickets = await getBoughtTicketsByUser(id)
        res.status(200).json({ tickets })
    } catch (error) {
        console.error(error)
        res.status(404).json({ message: error.message })
    }
}

module.exports={
    getUserById,
    register,
    deleteUser,
    updateUser,
    getBoughtTicketsByUserController
}