import config from "../config/config.js";
import { generateVerificationToken } from "../helpers/genrateToken.js";
import { authService } from "../services/auth.service.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { genrateJWTtoken } from "../helpers/genrateJWTtoken.js"


export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;
    const existingUser = await authService.findByUsernameAndEmail(username, email);
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }
    const { token, tokenExpire } = generateVerificationToken();
    const user = await authService.createUser({
        fullName,
        username,
        email,
        password,
        verificationToken: token,
        verificationTokenExpire: tokenExpire
    });
    const verifyLink = `${config.FRONTEND_URL}/api/auth/verify/${token}`;
    sendVerificationEmail(email, fullName, verifyLink)
    res.status(201).json(new ApiResponse(201, user, "User Register Successfully"));
})


export const loginController = asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;
    const user = await authService.findUserWithPassword(identifier);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    if (user.isBlocked) {
        return res.status(403).json({
            success: false,
            message: "Account is blocked"
        });
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const payload = {
        id: user._id,
        isVerified: user.isVerified
    };
    const token = genrateJWTtoken(payload)

    res.cookie('tokenai', token)

    res.status(200).json(new ApiResponse(200, payload,"Login successful"));

}
)

export const SendAgainVerifyMail = asyncHandler(async (req, res) => {
    const { email } = req.params
    const existingUser = await authService.findByEmail(email)
    if (!existingUser) {
        throw new ApiError(400, `User not exists`);
    }
    if (existingUser.isVerified) {
        throw new ApiError(400, `User already verified`);
    }
    const { token, tokenExpire } = generateVerificationToken();
    await authService.setVerificationToken(existingUser._id, token, tokenExpire)
    res.status(200).json(new ApiResponse(200, { message: "verification mail send succssfully" }));
})

export const verifyAccountController = asyncHandler(async (req, res) => {
    const { token } = req.params;
    if (!token) {
        throw new ApiError(400, "Verification token is required");
    }
    const user = await authService.FindUserToken(token)
    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }
    await authService.verifyUser(user._id)
    return res.status(200).json(
        new ApiResponse(200, null, "Account verified successfully")
    );

});


export const getUserProfile = asyncHandler(async (req, res) => {

    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await authService.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const userdata = {
        fullName : user.fullName,
        email: user.email,
        username: user.username,
        _id: user._id,
        createdAt: user.createdAt
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, userdata, "User profile fetched successfully")
        );
});


export const get_me = asyncHandler(async (req, res) => {
    const userdata = req.user;
    if (!userdata) {
        throw new ApiError(401, "Unauthorized access");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, userdata, "User fetched successfully")
        );
});

export const LogoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('tokenai')
    return res
        .status(200)
        .json(
            new ApiResponse(200, "User logout successfully")
        );
});

export const UserChangePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old password and new password are required");
    }

    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const user = await authService.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }
    user.password = newPassword;
    await user.save();
    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Password changed successfully")
        );


})

