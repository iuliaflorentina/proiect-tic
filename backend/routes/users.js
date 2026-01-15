const express=require('express')
const router=express.Router()

const userController=require("../controllers/users")
const { userValidator, loginValidator } = require('../validators/usersValidation')
const {validate} = require('../middlewares/validate')
const { validateToken } = require('../middlewares/auth')

router.post("/login",loginValidator,validate,userController.login)
router.post("/register",userValidator,validate,userController.register)
router.delete("/:id",validateToken, userController.deleteUserController)
router.put("/:id",validateToken,userController.updateUserData)
router.get("/:id",validateToken,userController.getUserById)
router.get("/boughtTickets/:id",validateToken,userController.getBoughtTicketsByUserController)

module.exports=router