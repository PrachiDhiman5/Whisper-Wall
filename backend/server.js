import 'dotenv/config';
import connectDB from './config/db.js';
import app from "./app.js";

// Bypass SSL certificate verification errors in development (fixes SELF_SIGNED_CERT_IN_CHAIN)
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    //console.log("⚠️  SSL Verification Disabled (Development Mode)");
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Backend Server is running on port ${PORT}.....`);
        });
    } catch (error) {
        console.error("Critical error during startup:", error);
    }
};

startServer();
