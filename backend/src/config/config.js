import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI: process.env.MONGO_URI,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_EMAIL: process.env.MAIL_EMAIL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    TAVILY_KEY: process.env.TAVILY_KEY,
    PINE_CODE: process.env.PINE_CODE,
    CORSORIGIN1: process.env.CORSORIGIN1,
    CORSORIGIN2: process.env.CORSORIGIN2,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_SECRET_CODE: process.env.GOOGLE_SECRET_CODE
}

export default config