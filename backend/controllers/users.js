const { findById, addUser, deleteUser, updateUser, getExistingUserEmail, getBoughtTicketsByUser } = require('../models/users')
const bcrypt = require("bcryptjs");
const { messaging } = require('firebase-admin');
const jwt = require("jsonwebtoken")

async function comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

function generateToken(user) {
    const data = {
        userId: user.id,
        email: user.email
    }

    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await getExistingUserEmail(email)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        console.log(user)
        const isPasswordValid = await comparePasswords(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is invalid" })
        }

        const token = generateToken(user)

        res.status(200).json({
            message: "Login successful",
            token,
            user
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await findById(id)
        console.log(user.data())

        if (!user.exists) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            id: user.id,
            ...user.data()
        })
    } catch (err) {
        res.status(500).json({ message: "Failed to get user" })
    }

}

const register = async (req, res) => {
    try {
        const { email, password, name, role, organizationName } = req.body
        const existingUser = await getExistingUserEmail(email)
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" })
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

        const token = generateToken(createdUser)

        res.status(201).json({
            token: token,
            user: createdUser,

        })
    } catch (err) {
        res.status(500).json({ message: "Failed to create user" })
    }
}

const deleteUserController = async (req, res) => {
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

module.exports = {
    login,
    getUserById,
    register,
    deleteUserController,
    updateUserData,
    getBoughtTicketsByUserController
}