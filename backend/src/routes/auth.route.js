import express from 'express'
import { LogoutUser, SendAgainVerifyMail, UserChangePassword, forgetPasswordRequest, forgetPasswordverifyController, getUserProfile, get_me, googleCallback, loginController, registerUser, verifyAccountController } from '../controllers/auth.controller.js'
import { changePasswordValidator, loginValidator, userRegisterValidator } from '../validators/auth.validate.js'
import { verifyUser } from '../middleware/auth.middleware.js'
import passport from 'passport'
import config from '../config/config.js'

const AuthRouter = express.Router()

AuthRouter.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] }))

AuthRouter.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV == 'development' ? `${config.FRONTEND_URL}/login` : `/login`
    }),
    googleCallback
)
AuthRouter.post('/register', userRegisterValidator, registerUser)
AuthRouter.post('/login', loginValidator, loginController)
AuthRouter.get("/verify/:token", verifyAccountController);
AuthRouter.patch('/send/mail/:email', SendAgainVerifyMail)
AuthRouter.get('/profile', verifyUser, getUserProfile)
AuthRouter.get('/get-me', verifyUser, get_me)
AuthRouter.get('/logout', verifyUser, LogoutUser)
AuthRouter.patch("/change-password", verifyUser, changePasswordValidator, UserChangePassword);
AuthRouter.put('/forgot/password', forgetPasswordRequest)
AuthRouter.post('/reset-password/:token', forgetPasswordverifyController)

export default AuthRouter