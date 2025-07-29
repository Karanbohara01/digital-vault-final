// controllers/userController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const axios = require('axios');

const { logActivity } = require('../services/logService');
const crypto = require('crypto');
const sendEmail = require('../utils/EmailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/;


const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, captchaToken } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;

        // 1. CAPTCHA Validation (Runs first)
        if (!captchaToken) {
            return res.status(400).json({ message: 'CAPTCHA token is required.' });
        }
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
        const recaptchaResponse = await axios.post(verifyUrl);

        if (!recaptchaResponse.data.success) {
            await logActivity(null, 'USER_REGISTER_FAIL', 'fatal', { email, ipAddress, reason: 'CAPTCHA verification failed.' });
            return res.status(400).json({ message: 'CAPTCHA verification failed. Please try again.' });
        }

        // 2. Input Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all required fields.' });
        }

        // 3. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            await logActivity(null, 'USER_REGISTER_FAIL', 'warn', { email, ipAddress, reason: 'Email already exists.' });
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // 4. Create User
        const user = await User.create({
            name,
            email,
            password, // Password will be hashed by the pre-save hook
            role,
            isVerified: false
        });

        // 5. Generate Verification Token and Send Email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        await user.save({ validateBeforeSave: false });

        const verificationURL = `${req.protocol}://${req.get('host')}/api/users/verify-email/${verificationToken}`;

        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email Address for Digital Vault',
            template: 'emailVerification',
            verificationURL: verificationURL,
        });

        await logActivity(user._id, 'USER_REGISTER_SUCCESS', 'info', { email, ipAddress });

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.'
        });

    } catch (error) {
        console.error('REGISTER ERROR:', error);
        await logActivity(null, 'REGISTER_CONTROLLER_ERROR', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error during registration' });
    }
};



const creatorDashboard = (req, res) => {
    res.status(200).json({ success: true, message: `Welcome Creator ${req.user.name}!` });
};



const verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.params.token;
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        const user = await User.findOne({ emailVerificationToken: hashedToken });

        if (!user) {
            await logActivity(null, 'EMAIL_VERIFICATION_FAIL', 'warn', {
                method: req.method,
                ipAddress: req.ip,
                reason: 'Invalid or expired token',
            });

            return res.status(400).send('<h1>Error</h1><p>Invalid verification token.</p>');
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        await logActivity(user._id, 'USER_EMAIL_VERIFIED', 'info', {
            email: user.email,
            method: req.method,
            ipAddress: req.ip,
        });

        // Redirect to frontend success page
        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

    } catch (error) {
        await logActivity(null, 'EMAIL_VERIFICATION_ERROR', 'error', {
            method: req.method,
            ipAddress: req.ip,
            error: error.message,
        });

        console.error('EMAIL VERIFICATION ERROR:', error);
        res.status(500).send('<h1>Error</h1><p>There was an error verifying your email.</p>');
    }
};




const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;

        const user = await User.findOne({ email });
        if (!user) {
            await logActivity(null, 'USER_LOGIN_FAIL', 'warn', {
                email,
                ipAddress,
                method: req.method,
                reason: 'User not found',
            });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.lockUntil && user.lockUntil > Date.now()) {
            await logActivity(user._id, 'USER_LOGIN_FAIL', 'fatal', {
                ipAddress,
                method: req.method,
                reason: 'Account locked',
            });
            const timeLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({ message: `Account is locked. Try again in ${timeLeft} minutes.` });
        }

        if (!(await user.matchPassword(password))) {
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 10) {
                user.lockUntil = Date.now() + 1 * 60 * 1000;
                await logActivity(user._id, 'ACCOUNT_LOCKED', 'fatal', {
                    ipAddress,
                    method: req.method,
                });
            }
            await user.save({ validateBeforeSave: false });
            await logActivity(user._id, 'USER_LOGIN_FAIL', 'warn', {
                email,
                ipAddress,
                method: req.method,
                attempts: user.failedLoginAttempts,
            });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            await logActivity(user._id, 'USER_LOGIN_FAIL', 'warn', {
                ipAddress,
                method: req.method,
                reason: 'Email not verified',
            });
            return res.status(403).json({ message: 'Please verify your email address.' });
        }

        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        await user.save({ validateBeforeSave: false });

        if (user.isMfaEnabled) {
            return res.json({ mfaRequired: true, userId: user._id });
        } else {
            await logActivity(user._id, 'USER_LOGIN_SUCCESS', 'info', {
                ipAddress,
                method: req.method,
            });
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

    } catch (error) {
        await logActivity(null, 'LOGIN_CONTROLLER_ERROR', 'error', {
            error: error.message,
            method: req.method,
        });
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUserProfile = async (req, res) => {
    // The user object is attached to the request in the 'protect' middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};



const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;

        // 1. Get user from the database
        const user = await User.findById(req.user._id);

        // 2. Check if posted current password is correct
        if (!(await user.matchPassword(currentPassword))) {
            await logActivity(user._id, 'USER_PASSWORD_UPDATE_FAIL', 'warn', { reason: 'Incorrect current password', ipAddress });
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        // 3. Check if new password is the same as the old one
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password.' });
        }

        // 4. Check for password reuse from history
        for (const oldPasswordHash of user.passwordHistory) {
            const isReused = await bcrypt.compare(newPassword, oldPasswordHash);
            if (isReused) {
                await logActivity(user._id, 'USER_PASSWORD_UPDATE_FAIL', 'warn', { reason: 'Password reuse detected', ipAddress });
                return res.status(400).json({ message: 'You cannot reuse a recent password.' });
            }
        }

        // 5. If all checks pass, set the new password and update timestamp
        user.password = newPassword;
        user.passwordChangedAt = Date.now();

        await user.save();

        await logActivity(user._id, 'USER_PASSWORD_UPDATE_SUCCESS', 'info', { ipAddress });

        // 6. Send back a new token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            message: 'Password updated successfully.',
        });

    } catch (error) {
        await logActivity(req.user?._id, 'PASSWORD_UPDATE_CONTROLLER_ERROR', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};




const forgotPassword = async (req, res) => {
    let user;
    try {
        const email = req.body.email;
        user = await User.findOne({ email });

        // Regardless of whether user exists, respond with success message to avoid enumeration
        if (!user) {
            await logActivity(null, 'FORGOT_PASSWORD_NO_USER', 'warn', {
                email,
                method: req.method,
                ipAddress: req.ip
            });

            return res.status(200).json({
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        // Prepare reset URL
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        await sendEmail({
            email: user.email,
            subject: 'Your Digital Vault Password Reset Token (valid for 10 min)',
            resetURL
        });

        await logActivity(user._id, 'FORGOT_PASSWORD_REQUESTED', 'info', {
            email,
            method: req.method,
            ipAddress: req.ip
        });

        res.status(200).json({
            message: 'If an account with that email exists, a password reset link has been sent.'
        });

    } catch (error) {
        if (user) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }

        await logActivity(user?._id || null, 'FORGOT_PASSWORD_ERROR', 'error', {
            error: error.message,
            method: req.method,
            ipAddress: req.ip
        });

        console.error('FORGOT PASSWORD ERROR:', error);
        res.status(500).json({
            message: 'There was an error sending the email. Please try again later.'
        });
    }
};



const mfaSetup = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const secret = speakeasy.generateSecret({
            name: `DigitalVault (${user.email})`,
        });

        user.mfaTempSecret = secret.base32;
        await user.save();

        qrcode.toDataURL(secret.otpauth_url, async (err, data_url) => {
            if (err) {
                await logActivity(user._id, 'MFA_QR_GENERATION_FAIL', 'error', {
                    error: err.message,
                    method: req.method,
                    ipAddress: req.ip,
                });
                throw new Error('Could not generate QR code');
            }

            await logActivity(user._id, 'MFA_SETUP_INITIATED', 'info', {
                method: req.method,
                ipAddress: req.ip,
            });

            res.json({ qrCodeUrl: data_url });
        });
    } catch (error) {
        console.error('MFA setup error:', error);
        await logActivity(req.user?._id, 'MFA_SETUP_FAIL', 'error', {
            error: error.message,
            method: req.method,
            ipAddress: req.ip,
        });
        res.status(500).json({ message: 'Server Error during MFA setup' });
    }
};



const mfaVerify = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.mfaTempSecret) {
            await logActivity(user._id, 'MFA_VERIFY_FAIL', 'warn', {
                method: req.method,
                ipAddress: req.ip,
                reason: 'Temp secret not found',
            });
            return res.status(400).json({ message: 'MFA setup has not been initiated.' });
        }

        const isVerified = speakeasy.totp.verify({
            secret: user.mfaTempSecret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (isVerified) {
            const recoveryCodes = [];
            const hashedRecoveryCodes = [];

            for (let i = 0; i < 10; i++) {
                const code = crypto.randomBytes(4).toString('hex');
                recoveryCodes.push(code);
                hashedRecoveryCodes.push(crypto.createHash('sha256').update(code).digest('hex'));
            }

            user.mfaRecoveryCodes = hashedRecoveryCodes;
            user.mfaSecret = user.mfaTempSecret;
            user.mfaTempSecret = undefined;
            user.isMfaEnabled = true;
            await user.save();

            await logActivity(user._id, 'MFA_ENABLE_SUCCESS', 'info', {
                method: req.method,
                ipAddress: req.ip,
            });

            res.json({
                message: 'MFA has been successfully enabled! Please save these recovery codes.',
                recoveryCodes: recoveryCodes,
            });
        } else {
            await logActivity(user._id, 'MFA_ENABLE_FAIL', 'warn', {
                method: req.method,
                ipAddress: req.ip,
                reason: 'Invalid token',
            });
            res.status(400).json({ message: 'Invalid MFA token. Please try again.' });
        }
    } catch (error) {
        console.error('MFA verification error:', error);
        await logActivity(req.user?._id, 'MFA_VERIFY_FAIL', 'error', {
            error: error.message,
            method: req.method,
            ipAddress: req.ip,
        });
        res.status(500).json({ message: 'Server Error during MFA verification' });
    }
};

const mfaRecover = async (req, res) => {
    let user;
    try {
        const { email, recoveryCode } = req.body;

        if (!email || !recoveryCode) {
            await logActivity(null, 'MFA_RECOVERY_MISSING_FIELDS', 'warn', {
                method: req.method,
                ipAddress: req.ip,
                email
            });
            return res.status(400).json({ message: 'Email and recovery code are required.' });
        }

        user = await User.findOne({ email });

        const hashedCode = crypto.createHash('sha256').update(recoveryCode).digest('hex');

        if (!user || !user.mfaRecoveryCodes.includes(hashedCode)) {
            await logActivity(user?._id || null, 'MFA_RECOVERY_FAIL', 'fatal', {
                email,
                method: req.method,
                ipAddress: req.ip,
                reason: 'Invalid recovery code or user not found'
            });
            return res.status(401).json({ message: 'Invalid recovery code or email.' });
        }

        user.mfaRecoveryCodes = user.mfaRecoveryCodes.filter(code => code !== hashedCode);
        await user.save();

        await logActivity(user._id, 'MFA_RECOVERY_SUCCESS', 'info', {
            method: req.method,
            ipAddress: req.ip,
            email
        });

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('MFA recovery error:', error);
        await logActivity(user?._id || null, 'MFA_RECOVERY_ERROR', 'error', {
            error: error.message,
            method: req.method,
            ipAddress: req.ip,
            email
        });
        res.status(500).json({ message: 'Server Error during MFA recovery' });
    }
};


const mfaLoginVerify = async (req, res) => {
    try {
        const { userId, token } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the token against the user's permanent secret
        const isVerified = speakeasy.totp.verify({
            secret: user.mfaSecret, // Note: using the permanent secret
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (isVerified) {
            // If the MFA token is correct, NOW we grant access by sending the JWT
            await logActivity(user._id, 'USER_LOGIN_SUCCESS_MFA', 'info', { ipAddress: req.ip });
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id), // Generate the final token here
            });
        } else {
            await logActivity(user._id, 'MFA_LOGIN_FAIL', 'warn', { ipAddress: req.ip });
            res.status(401).json({ message: 'Invalid MFA token.' });
        }
    } catch (error) {
        console.error('MFA login verification error:', error);
        await logActivity(req.body.userId, 'MFA_LOGIN_VERIFY_FAIL', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error during MFA login verification' });
    }
};


const resetPassword = async (req, res) => {
    try {
        // 1. Get the plain token from the URL
        const resetToken = req.params.token;

        // 2. Hash the token to find the matching token in the database
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 3. Find the user by the hashed token and check if the token has not expired
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }, // $gt means "greater than"
        });

        // 4. If token is invalid or expired, send an error
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        // 5. If the token is valid, set the new password
        user.password = req.body.password;
        // Clear the reset token fields so it can't be used again
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        // Set the password changed timestamp
        user.passwordChangedAt = Date.now();

        await user.save();

        // Log the user in by sending back a new JWT
        await logActivity(user._id, 'USER_PASSWORD_RESET_SUCCESS', 'info', { ipAddress: req.ip });
        res.status(200).json({
            token: generateToken(user._id),
            message: 'Password reset successfullys.'
        });

    } catch (error) {
        console.error('RESET PASSWORD ERROR:', error);
        res.status(500).json({ message: "There was an error resetting the password." });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


const updateUserByAdmin = async (req, res) => {
    console.log('✅ updateUserByAdmin called');

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Admin can update name, email, and role.
        // We don't allow changing the password from this endpoint for security.
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;

        const updatedUser = await user.save();

        await logActivity(req.user.id, 'ADMIN_UPDATE_USER_SUCCESS', 'warn', { updatedUserId: updatedUser._id });
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });

    } catch (error) {
        await logActivity(req.user.id, 'ADMIN_UPDATE_USER_FAIL', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error' });
    }
};


const deleteUserByAdmin = async (req, res) => {
    console.log('deleteUserByAdmin called');

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user._id.equals(req.user.id)) {
            return res.status(400).json({ message: 'Admin cannot delete their own account.' });
        }
        await User.findByIdAndDelete(req.params.id);
        await logActivity(req.user.id, 'ADMIN_DELETE_USER_SUCCESS', 'fatal', { deletedUserId: req.params.id, deletedUserEmail: user.email });
        res.json({ message: 'User removed successfully' });
    } catch (error) {
        await logActivity(req.user.id, 'ADMIN_DELETE_USER_FAIL', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    creatorDashboard,
    updatePassword,
    mfaSetup,
    mfaVerify,
    mfaLoginVerify,
    forgotPassword,
    resetPassword,
    mfaRecover,
    verifyEmail,
    getUsers,
    updateUserByAdmin,
    deleteUserByAdmin,
    getUserById

};