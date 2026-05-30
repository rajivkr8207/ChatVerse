import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from 'cors';
import config from "./config/config.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import hpp from "hpp";
import path from "path";
export const Middleware = (app) => {
    app.use(helmet());

    app.use(compression());

    app.use(cors({
        origin: [config.CORSORIGIN1, config.CORSORIGIN2],
        credentials: true
    }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000,
        message: 'Too many requests from this IP, please try again in 15 minutes'
    });
    app.use('/api', limiter);
    app.use(express.json({ limit: '16kb' }));
    app.use(express.urlencoded({ extended: true, limit: '16kb' }));
    // app.use(mongoSanitize());
    app.use(hpp());
    app.use(morgan('dev'));
    app.use(cookieParser());

    app.use(passport.initialize());
    passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_SECRET_CODE,
        callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }));

    app.use(express.static('./public/dist'));

    app.set('view engine', 'ejs');

};