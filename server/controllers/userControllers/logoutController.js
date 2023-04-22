const User = require('../../models/user'); // Import the User model

const handleLogout = async (req, res, next) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    await foundUser.save();
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
    res.sendStatus(204);
}

module.exports = { handleLogout }