import express from 'express';
import passport from './google.strategy.js';
import { googleAuthCallback } from "./auth.controller.js";

const router = express.Router();

router.get('/google', passport.authenticate("google", {
    scope: ["profile", "email"],
}));

router.get("/google/callback", passport.authenticate("google", {
    session: true,
    failureRedirect: "http://localhost:5173/?error=auth_failed",
}), googleAuthCallback);

export default router;