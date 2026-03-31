import express from 'express'
import { LogoutUser, SendAgainVerifyMail, UserChangePassword, forgetPasswordRequest, forgetPasswordverifyController, getUserProfile, get_me, loginController, registerUser, verifyAccountController } from '../controllers/auth.controller.js'
import { loginValidator, userRegisterValidator } from '../validators/auth.validate.js'
import { verifyUser } from '../middleware/auth.middleware.js'

const AuthRouter = express.Router()


AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', loginValidator, loginController)
AuthRouter.get("/verify/:token", verifyAccountController);
AuthRouter.patch('/send/mail/:email', SendAgainVerifyMail)
AuthRouter.get('/profile', verifyUser, getUserProfile)
AuthRouter.get('/get-me', verifyUser, get_me)
AuthRouter.get('/logout', verifyUser, LogoutUser)
AuthRouter.patch("/change-password", verifyUser, UserChangePassword);
AuthRouter.put('/forgot/password', forgetPasswordRequest)
AuthRouter.post('/reset-password/:token', forgetPasswordverifyController)

export default AuthRouter