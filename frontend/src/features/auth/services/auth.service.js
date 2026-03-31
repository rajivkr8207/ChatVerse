import { api } from "../../../lib/api/axios"; 




export async function RegisterUser({ fullName, username, email, password }) {
    const res = await api.post('api/auth/register', { fullName, username, email, password })
    return res.data
}

export async function LoginUser({ identifier, password }) {
    const res = await api.post('api/auth/login', { identifier, password })
    return res.data
}


export async function VerifyEmailApi(token) {
    const res = await api.get(`api/auth/verify/${token}`)
    return res.data
}


export async function VerifyEmailSendAgain(email) {
    const res = await api.patch(`api/auth/send/mail/${email}`)
    return res.data
}


export async function UserChangePassowrd({ oldPassword, newPassword }) {
    const res = await api.patch(`api/auth/change-password`, { oldPassword, newPassword })
    return res.data
}

export async function UserProfie() {
    const res = await api.get('api/auth/profile')
    return res.data
}

export async function UserGetMe() {
    const res = await api.get('api/auth/get-me')
    return res.data
}

export async function Userlogout() {
    const res = await api.get('api/auth/logout')
    return res.data
}

export async function ForgotPassword(data) {
    const res = await api.put('api/auth/forgot/password', data)
    return res.data
}


export async function ForgotPasswordVerify(token, { newPassword }) {
    const res = await api.post(`api/auth/reset-password/${token}`, { newPassword })
    return res.data
}