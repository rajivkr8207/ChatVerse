import { api } from "../../../lib/api/axios";




export async function RegisterUser({ fullName, username, email, password }) {
    const res = await api.post('/auth/register', { fullName, username, email, password })
    return res.data
}

export async function LoginUser({ identifier, password }) {
    const res = await api.post('/auth/login', { identifier, password })
    return res.data
}


export async function VerifyEmailApi(token) {
    const res = await api.get(`/auth/verify/${token}`)
    return res.data
}


export async function VerifyEmailSendAgain(email) {
    const res = await api.patch(`/auth/send/mail/${email}`)
    return res.data
}


export async function UserChangePassowrd({ oldPassword, newPassword }) {
    const res = await api.patch(`/auth/change-password`, { oldPassword, newPassword })
    return res.data
}

export async function UserProfie() {
    const res = await api.get('/auth/profile')
    return res.data
}

export async function UserGetMe() {
    const res = await api.get('/auth/get-me')
    return res.data
}

export async function Userlogout() {
    const res = await api.get('/auth/logout')
    return res.data
}