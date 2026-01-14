const { body } = require("express-validator")

const eventValidator = [
  body("name")
    .notEmpty()
    .withMessage("Event name is required")
    .isLength({ min: 3 })
    .withMessage("Event name must be at least 3 characters long"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Event date must be a valid ISO 8601 date")
    .custom(value => {
      if (new Date(value) <= new Date()) {
        throw new Error("Event date must be in the future")
      }
      return true
    }),

  body("isPublic")
    .isBoolean()
    .withMessage("isPublic must be a boolean"),

  body("organizationName")
    .notEmpty()
    .withMessage("Organization name is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isObject()
    .withMessage("Location must be an object"),
    
  body("location.id")
    .optional()
    .notEmpty()
    .withMessage("Id cannot be empty"),

  body("location.name")
    .optional()
    .notEmpty()
    .withMessage("Location name cannot be empty"),

  body("location.address")
    .optional()
    .notEmpty()
    .withMessage("Location address cannot be empty"),

  body("location.city")
    .optional()
    .notEmpty()
    .withMessage("Location city cannot be empty"),

  body("location.capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Location capacity must be greater than 0"),

  body("tickets")
    .isArray()
    .withMessage("Tickets must be an array"),

   body("tickets.*.type")
    .notEmpty()
    .withMessage("Ticket type is required")
    .isIn(["standard", "vip"])
    .withMessage("Ticket type must be standard or vip"),

  body("tickets.*.price")
    .isNumeric()
    .withMessage("Ticket price must be a number")
    .custom(value => value > 0)
    .withMessage("Ticket price must be greater than 0"),

  body("tickets.*.availableQuantity")
    .isInt({ min: 0 })
    .withMessage("Ticket quantity must be an integer >= 0")
]

module.exports = { eventValidator }
