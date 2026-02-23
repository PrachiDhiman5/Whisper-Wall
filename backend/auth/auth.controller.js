import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            anonymousId: user.anonymousId || "#0000000"
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};


export const googleAuthCallback = async (req, res, next) => {
    try {
        console.log("Google Auth Callback Controller Hit");
        const user = req.user;

        if (!user) {
            console.log("No user found in session/request");
            return res.redirect("http://localhost:5173/?error=auth_failed");
        }

        if (!user.anonymousId) {
            user.anonymousId = `#${Math.floor(1000000 + Math.random() * 9000000)}`;
            await user.save();
        }

        const token = generateToken(user);
        console.log("Token generated for user:", user.email, "AnonID:", user.anonymousId);

        res.redirect(`http://localhost:5173/auth-callback?token=${token}`);
    } catch (error) {
        console.error("Auth Controller Error:", error);
        next(error);
    }
};