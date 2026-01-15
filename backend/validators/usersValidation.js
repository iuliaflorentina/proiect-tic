const {body}=require('express-validator')

const userValidator=[
    body('name')
    .isLength({min:3})
    .withMessage("Your name must have more than 3 characters!"),

    body("email")
    .isEmail()
    .withMessage("Invalid email"),
    body("password")
    .isLength({ min: 6 })
    .withMessage("Password must have minimum 6 characters"),

  body("role")
    .isIn(["client", "organizer"])
    .withMessage("Invalid role"),

  body("organizationName")
    .if(body("role").equals("organizer"))
    .notEmpty()
    .withMessage("Organization name is required for organizer role"),

 body("boughtTickets")
    .optional()
    .isArray()
    .withMessage("Bought tickets must be an array"),

  body("boughtTickets.*.ticketId")
    .optional()
    .isString()
    .withMessage("ticketId must be a string"),

  body("boughtTickets.*.event")
    .optional()
    .isObject()
    .withMessage("eventName must be an object"),
 
  body("boughtTickets.*.event.eventId")
    .optional()
    .isString(),

  body("boughtTickets.*.event.name")
    .optional()
    .isString(),

  body("boughtTickets.*.event.date")
    .optional()
    .isISO8601()
    .withMessage("Event date must be a valid ISO 8601 date"),

  body("boughtTickets.*.event.adress")
    .optional()
    .isString(),

  body("boughtTickets.*.type")
    .optional()
    .isIn(["standard", "vip"])
    .withMessage("Ticket type must be standard or vip"),

  body("boughtTickets.*.price")
    .optional()
    .isNumeric()
    .withMessage("Ticket price must be a number")
]

const loginValidator=[
  body("email")
  .isEmail()
  .withMessage("Invalid email!"),
  body("password")
  .isLength({ min: 6 })
  .withMessage("Password must have minimum 6 characters")
]
module.exports={userValidator,loginValidator}