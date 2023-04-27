const User = require('../../models/user'); // Import the User model

const handleLogout = async (req, res, next) => {

    // Get refresh token from cookie
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    // Clear cookie from browser
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    
    //clear refresh token from database
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(204);
    foundUser.refreshToken = '';
    await foundUser.save();
    res.sendStatus(204);
}

module.exports = { handleLogout }