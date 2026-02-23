import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './auth/google.strategy.js';
import authRoutes from "./auth/auth.routes.js";
import confessionRoutes from './routes/confession.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import logger from './middlewares/logger.js';

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(logger);

// Session configuration
app.use(session({
    secret: process.env.JWT_SECRET || 'confession_wall_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use('/confessions', confessionRoutes);

// Error Handling
app.use(errorMiddleware);

export default app;
