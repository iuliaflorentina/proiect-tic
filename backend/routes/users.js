const express=require('express')
const router=express.Router()

const userController=require("../controllers/users")
const { userValidator } = require('../validators/usersValidation')
const {validate} = require('../middlewares/validate')

router.post("/register",userValidator,validate,userController.register())
router.delete("/:id",userController.deleteUser())
router.put("/:id",userController.updateUser())
router.get("/:id",userController.getUserById())
router.get("/boughtTickets/:id",userController.getBoughtTicketsByUserController())

module.exports=router