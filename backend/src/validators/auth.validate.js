import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";

export const userRegisterValidator = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Full name must be between 2 and 50 characters"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be between 3 and 30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscore"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain one number"),

    validate
];


export const loginValidator = [
    body("identifier")
        .trim()
        .notEmpty()
        .withMessage("Username or Email is required"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),

    validate
];

export const changePasswordValidator = [

    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),

    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
    validate
];