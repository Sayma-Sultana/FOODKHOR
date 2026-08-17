export const sendCookie = (user, res, message, statusCode = 200) => {
    const token = user.generateToken();
    res.status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            sameSite: process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes("localhost") ? "lax" : "none",
            secure: process.env.FRONTEND_URL && process.env.FRONTEND_URL.includes("localhost") ? false : true,
        })
        .json({
            success: true,
            message,
            user,
        });
};
