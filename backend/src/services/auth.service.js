import UserModel from "../models/user.model.js";

class AuthService {
    // create new user
    async createUser(userData) {
        const user = await UserModel.create(userData);
        return user;
    }

    async findByUsernameAndEmail(username, email) {
        const user = await UserModel.findOne(
            {
                $or: [
                    { username },
                    { email }
                ]
            }
        );
        return user;
    }

    // find user by username
    async findByUsername(username) {
        const user = await UserModel.findOne({ username });
        return user;
    }

    // find user by email
    async findByEmail(email) {
        const user = await UserModel.findOne({ email });
        return user;
    }

    // find user by id
    async findById(userId) {
        const user = await UserModel.findById(userId).select('+password');
        return user;
    }

    // find user with password (for login)
    async findUserWithPassword(identifier) {
        const user = await UserModel.findOne({
            $or: [
                { email: identifier },
                { username: identifier }
            ]
        }).select("+password");

        return user;
    }

    // find verification token
    async FindUserToken(token) {
        return await UserModel.findOne({
            verificationToken: token,
            verificationTokenExpire: { $gt: Date.now() }
        });
    }

    // update verification token
    async setVerificationToken(userId, token, expire) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                verificationToken: token,
                verificationTokenExpire: expire
            },
            { new: true }
        );
    }

    // verify account
    async verifyUser(userId) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                isVerified: true,
                verificationToken: null,
                verificationTokenExpire: null
            },
            { new: true }
        );
    }

    // set forgot password token
    async setForgotPasswordToken(userId, token, expire) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                forgotPasswordToken: token,
                forgotPasswordTokenExpire: expire
            },
            { new: true }
        );
    }

    // reset password
    async resetPassword(userId, newPassword) {
        return await UserModel.findByIdAndUpdate(
            userId,
            {
                password: newPassword,
                forgotPasswordToken: null,
                forgotPasswordTokenExpire: null
            },
            { new: true }
        );
    }

    // block user
    async blockUser(userId) {
        return await UserModel.findByIdAndUpdate(
            userId,
            { isBlocked: true },
            { new: true }
        );
    }

}

export const authService = new AuthService();