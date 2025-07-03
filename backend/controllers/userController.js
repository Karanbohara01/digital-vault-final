// controllers/userController.js

const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken'); // 1. Import jwt
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
// At the top of controllers/userController.js
const { logActivity } = require('../services/logService');
const crypto = require('crypto');
const sendEmail = require('../utils/EmailService'); // Import the email service



// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
// const registerUser = async (req, res) => {
//     try {
//         // Get the data from the request body
//         const { name, email, password, role } = req.body;

//         // --- Basic Validation ---
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: 'Please enter all fields' });
//         }

//         // Check if user already exists
//         const userExists = await User.findOne({ email });

//         if (userExists) {
//             return res.status(400).json({ message: 'User with this email already exists' });
//         }

//         // --- Create a new user ---
//         // The password will be automatically hashed because of the pre-save hook in our model
//         const user = await User.create({
//             name,
//             email,
//             password,
//             role // 'role' is optional, will default to 'customer' if not provided
//         });

//         // If user was created successfully
//         if (user) {
//             // <<< LOG USER REGISTRATION >>>
//             await logActivity(user._id, 'USER_REGISTER_SUCCESS', 'info', { email: user.email, ipAddress: req.ip || req.connection.remoteAddress });

//             // Send a success response
//             res.status(201).json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 message: 'User registered successfully!'
//             });
//         } else {
//             res.status(400).json({ message: 'Invalid user data' });
//         }
//     } catch (error) {
//         // Handle any other errors
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// In backend/controllers/userController.js

// In backend/controllers/userController.js

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            isVerified: false // Ensure user starts as unverified
        });

        // --- THIS IS THE CORRECTED LOGIC ---
        // 1. Generate a verification token (not a password reset token)
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 2. Hash it and save it to the correct field in the database
        user.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        await user.save({ validateBeforeSave: false });

        // 3. Create the correct verification URL
        // This is the correct line. It creates a link to the backend API endpoint.
        const verificationURL = `${req.protocol}://${req.get('host')}/api/users/verify-email/${verificationToken}`;

        // 4. Create the correct email message
        const message = `Welcome to Digital Vault! Please click the link below to verify your email address and activate your account:\n\n${verificationURL}`;

        // 5. Send the email
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email Address for Digital Vault',
            template: 'emailVerification', // Tell the service which template to use
            verificationURL: verificationURL // Pass the correct URL
        });

        await logActivity(user._id, 'USER_REGISTER_SUCCESS', 'info', { email });

        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.'
        });

    } catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({ message: 'Server Error during registration' });
    }
};
// --- Helper Function to Generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will be valid for 30 days
    });
};

// @desc    Placeholder for a creator-only action
// @route   GET /api/users/creator-dashboard
// @access  Private/Creator
const creatorDashboard = (req, res) => {
    res.status(200).json({ success: true, message: `Welcome Creator ${req.user.name}!` });
};

// In backend/controllers/userController.js

// @desc    Verify user's email address
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        // 1. Get the plain token from the URL
        const verificationToken = req.params.token;

        // 2. Hash the token to find the matching token in the database
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // 3. Find the user by the hashed token
        const user = await User.findOne({ emailVerificationToken: hashedToken });

        // 4. If no user is found, the token is invalid
        if (!user) {
            return res.status(400).send('<h1>Error</h1><p>Invalid verification token.</p>');
        }

        // 5. If the token is valid, update the user
        user.isVerified = true;
        user.emailVerificationToken = undefined; // Clear the token so it can't be used again
        await user.save();

        await logActivity(user._id, 'USER_EMAIL_VERIFIED', 'info', {});

        // Redirect the user to a success page on the frontend
        res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);

    } catch (error) {
        console.error('EMAIL VERIFICATION ERROR:', error);
        res.status(500).send('<h1>Error</h1><p>There was an error verifying your email.</p>');
    }
};



// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         // Get user's IP address from the request for logging
//         const ipAddress = req.ip || req.connection.remoteAddress;

//         if (!email || !password) {
//             return res.status(400).json({ message: 'Please provide email and password' });
//         }

//         const user = await User.findOne({ email });

//         // --- Check if user exists AND if password matches ---
//         if (user && (await user.matchPassword(password))) {
//             // <<< LOG SUCCESSFUL LOGIN >>>
//             await logActivity(user._id, 'USER_LOGIN_SUCCESS', 'info', { ipAddress });

//             res.status(200).json({
//                 _id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 token: generateToken(user._id),
//             });
//         } else {
//             // --- If login fails ---
//             const userId = user ? user._id : null; // Get user ID if user exists, otherwise null
//             // <<< LOG FAILED LOGIN ATTEMPT >>>
//             await logActivity(userId, 'USER_LOGIN_FAIL', 'warn', { email, ipAddress });

//             res.status(401).json({ message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         // <<< LOG SERVER ERROR DURING LOGIN >>>
//         await logActivity(null, 'LOGIN_CONTROLLER_ERROR', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// In backend/controllers/userController.js

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const ipAddress = req.ip || req.connection.remoteAddress;

//         if (!email || !password) {
//             return res.status(400).json({ message: 'Please provide email and password' });
//         }

//         const user = await User.findOne({ email });

//         // Check password first
//         if (user && (await user.matchPassword(password))) {
//             // <<< --- NEW MFA CHECK --- >>>
//             // After password is correct, check if user has MFA enabled
//             if (user.isMfaEnabled) {
//                 // If MFA is enabled, DO NOT send the final token.
//                 // Instead, send a signal that MFA is required.
//                 res.json({
//                     mfaRequired: true,
//                     userId: user._id,
//                 });
//             } else {
//                 // If MFA is not enabled, log in as normal.
//                 await logActivity(user._id, 'USER_LOGIN_SUCCESS', 'info', { ipAddress });
//                 res.status(200).json({
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     token: generateToken(user._id),
//                 });
//             }
//         } else {
//             // If login fails (wrong password or user not found)
//             const userId = user ? user._id : null;
//             await logActivity(userId, 'USER_LOGIN_FAIL', 'warn', { email, ipAddress });
//             res.status(401).json({ message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         await logActivity(null, 'LOGIN_CONTROLLER_ERROR', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// A final, polished version of the loginUser controller

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress;

        // 1. Check for user
        const user = await User.findOne({ email });
        if (!user) {
            await logActivity(null, 'USER_LOGIN_FAIL', 'warn', { email, ipAddress, reason: 'User not found' });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            await logActivity(user._id, 'USER_LOGIN_FAIL', 'fatal', { reason: 'Account locked', ipAddress });
            const timeLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(403).json({ message: `Account is locked. Please try again in ${timeLeft} minutes.` });
        }

        // 3. Check if password is correct
        if (!(await user.matchPassword(password))) {
            // If password fails, increment attempts and lock if necessary
            user.failedLoginAttempts += 1;
            if (user.failedLoginAttempts >= 10) {
                user.lockUntil = Date.now() + 1 * 60 * 1000; // Lock for 30 mins
                await logActivity(user._id, 'ACCOUNT_LOCKED', 'fatal', { ipAddress });
            }
            await user.save({ validateBeforeSave: false });
            await logActivity(user._id, 'USER_LOGIN_FAIL', 'warn', { email, ipAddress, attempts: user.failedLoginAttempts });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Check if email is verified
        if (!user.isVerified) {
            await logActivity(user._id, 'USER_LOGIN_FAIL', 'warn', { reason: 'Email not verified', ipAddress });
            return res.status(403).json({ message: 'Please verify your email address to log in.' });
        }

        // --- ALL CHECKS PASSED: PROCEED WITH SUCCESSFUL LOGIN ---

        // Reset lock state on successful login
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        await user.save({ validateBeforeSave: false });

        // Proceed with MFA check or final login
        if (user.isMfaEnabled) {
            return res.json({ mfaRequired: true, userId: user._id });
        } else {
            await logActivity(user._id, 'USER_LOGIN_SUCCESS', 'info', { ipAddress });
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

    } catch (error) {
        await logActivity(null, 'LOGIN_CONTROLLER_ERROR', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error' });
    }
};

// In backend/controllers/userController.js
// In backend/controllers/userController.js

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const ipAddress = req.ip || req.connection.remoteAddress;

//         const user = await User.findOne({ email });

//         if (user && (await user.matchPassword(password))) {
//             // --- NEW: Check for password expiry AT THE POINT OF LOGIN ---
//             if (user.passwordChangedAt) {
//                 // Define your policy (e.g., 90 days)
//                 const passwordAgeInDays = (Date.now() - user.passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24);
//                 if (passwordAgeInDays > 90) {
//                     await logActivity(user._id, 'USER_LOGIN_FAIL', 'warn', { reason: 'Password expired', ipAddress });
//                     // Send a specific error telling them what to do
//                     return res.status(403).json({ message: 'Your password has expired. Please use the "Forgot Password" link to reset it.' });
//                 }
//             }

//             // Check if email is verified
//             if (!user.isVerified) {
//                 return res.status(403).json({ message: 'Please verify your email address to log in.' });
//             }

//             // If everything passes, proceed with MFA or normal login
//             if (user.isMfaEnabled) {
//                 res.json({ mfaRequired: true, userId: user._id });
//             } else {
//                 await logActivity(user._id, 'USER_LOGIN_SUCCESS', 'info', { ipAddress });
//                 res.status(200).json({
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     token: generateToken(user._id),
//                 });
//             }
//         } else {
//             // This handles invalid email or password
//             const userId = user ? user._id : null;
//             await logActivity(userId, 'USER_LOGIN_FAIL', 'warn', { email, ipAddress });
//             res.status(401).json({ message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         await logActivity(null, 'LOGIN_CONTROLLER_ERROR', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires a valid token)
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


// @desc    Update user password
// @route   PATCH /api/users/update-password
// @access  Private
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


// In backend/controllers/userController.js

const forgotPassword = async (req, res) => {
    let user; // <-- The fix is to declare the user variable here
    try {
        // 1. Get user based on posted email
        user = await User.findOne({ email: req.body.email });

        // If there's no user, send a success response to prevent email enumeration
        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // 2. Generate and save the reset token and expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // --- Replace it with this NEW section ---
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail({
            email: user.email,
            subject: 'Your Digital Vault Password Reset Token (valid for 10 min)',
            resetURL: resetURL // Pass the URL to the email service
        });

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        // Now the 'user' variable is accessible here
        if (user) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }
        console.error('FORGOT PASSWORD ERROR:', error);
        res.status(500).json({ message: "There was an error sending the email. Please try again later." });
    }
};

// @desc    Generate a secret and QR code for MFA setup
// @route   POST /api/users/mfa/setup
// @access  Private
const mfaSetup = async (req, res) => {
    try {
        // Generate a new MFA secret for the user
        const secret = speakeasy.generateSecret({
            name: `DigitalVault (${req.user.email})`, // This name will appear in their authenticator app
        });

        // Find the user in the database
        const user = await User.findById(req.user.id);

        // Save the temporary secret to the user's document
        user.mfaTempSecret = secret.base32;
        await user.save();

        // Generate a QR code image from the secret's otpauth_url
        qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                throw new Error('Could not generate QR code');
            }
            // Send the QR code image data back to the frontend
            res.json({
                qrCodeUrl: data_url,
                // secret: secret.base32
            });
        });

    } catch (error) {
        console.error('MFA setup error:', error);
        await logActivity(req.user?._id, 'MFA_SETUP_FAIL', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error during MFA setup' });
    }
};

// In backend/controllers/userController.js

// @desc    Verify the MFA setup token and enable MFA
// @route   POST /api/users/mfa/verify
// @access  Private
// const mfaVerify = async (req, res) => {
//     try {
//         // Get the 6-digit token from the user's request
//         const { token } = req.body;

//         // Find the user in the database
//         const user = await User.findById(req.user.id);

//         if (!user.mfaTempSecret) {
//             return res.status(400).json({ message: 'MFA setup has not been initiated.' });
//         }

//         // Verify the token the user provided against the temporary secret
//         const isVerified = speakeasy.totp.verify({
//             secret: user.mfaTempSecret,
//             encoding: 'base32',
//             token: token,
//             window: 1 // Allow for a 30-second time drift
//         });

//         if (isVerified) {
//             // If verified, move the secret to the permanent field
//             user.mfaSecret = user.mfaTempSecret;
//             user.mfaTempSecret = undefined; // Clear the temporary secret
//             user.isMfaEnabled = true; // Enable MFA for the user
//             await user.save();

//             await logActivity(user._id, 'MFA_ENABLE_SUCCESS', 'info', { ipAddress: req.ip });
//             res.json({ message: 'MFA has been successfully enabled!' });
//         } else {
//             await logActivity(user._id, 'MFA_ENABLE_FAIL', 'warn', { ipAddress: req.ip });
//             res.status(400).json({ message: 'Invalid MFA token. Please try again.' });
//         }
//     } catch (error) {
//         console.error('MFA verification error:', error);
//         await logActivity(req.user?._id, 'MFA_VERIFY_FAIL', 'error', { error: error.message });
//         res.status(500).json({ message: 'Server Error during MFA verification' });
//     }
// };

// In backend/controllers/userController.js

const mfaVerify = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.mfaTempSecret) {
            return res.status(400).json({ message: 'MFA setup has not been initiated.' });
        }

        const isVerified = speakeasy.totp.verify({
            secret: user.mfaTempSecret,
            encoding: 'base32',
            token: token,
            window: 1
        });

        if (isVerified) {
            // --- NEW: Generate and save recovery codes ---
            const recoveryCodes = [];
            const hashedRecoveryCodes = [];

            for (let i = 0; i < 10; i++) {
                // Create a simple, random 8-character code
                const code = crypto.randomBytes(4).toString('hex');
                recoveryCodes.push(code);

                // Hash the code before saving it to the database
                const hashCode = crypto.createHash('sha256').update(code).digest('hex');
                hashedRecoveryCodes.push(hashCode);
            }

            user.mfaRecoveryCodes = hashedRecoveryCodes; // Save hashed codes

            // Finalize MFA enablement
            user.mfaSecret = user.mfaTempSecret;
            user.mfaTempSecret = undefined;
            user.isMfaEnabled = true;
            await user.save();

            await logActivity(user._id, 'MFA_ENABLE_SUCCESS', 'info', { ipAddress: req.ip });

            // Send the plain-text codes back to the user ONCE.
            res.json({
                message: 'MFA has been successfully enabled! Please save these recovery codes.',
                recoveryCodes: recoveryCodes, // Send plain codes to the user
            });
        } else {
            await logActivity(user._id, 'MFA_ENABLE_FAIL', 'warn', { ipAddress: req.ip });
            res.status(400).json({ message: 'Invalid MFA token. Please try again.' });
        }
    } catch (error) {
        console.error('MFA verification error:', error);
        await logActivity(req.user?._id, 'MFA_VERIFY_FAIL', 'error', { error: error.message });
        res.status(500).json({ message: 'Server Error during MFA verification' });
    }
};

// In backend/controllers/userController.js

// @desc    Log in using a one-time MFA recovery code
// @route   POST /api/users/mfa/recover
// @access  Public
const mfaRecover = async (req, res) => {
    try {
        const { email, recoveryCode } = req.body;

        if (!email || !recoveryCode) {
            return res.status(400).json({ message: 'Email and recovery code are required.' });
        }

        const user = await User.findOne({ email });

        // Hash the provided recovery code to compare with what's in the database
        const hashedCode = crypto.createHash('sha256').update(recoveryCode).digest('hex');

        // Check if the user exists and if the hashed code is in their list of recovery codes
        if (!user || !user.mfaRecoveryCodes.includes(hashedCode)) {
            await logActivity(user?._id, 'MFA_RECOVERY_FAIL', 'fatal', { email, ipAddress: req.ip });
            return res.status(401).json({ message: 'Invalid recovery code or email.' });
        }

        // --- If the code is valid ---
        // 1. Remove the used code from the array to make it single-use
        user.mfaRecoveryCodes = user.mfaRecoveryCodes.filter(code => code !== hashedCode);
        await user.save();

        // 2. Log the user in by issuing a new JWT
        await logActivity(user._id, 'MFA_RECOVERY_SUCCESS', 'info', { ipAddress: req.ip });
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('MFA recovery error:', error);
        res.status(500).json({ message: 'Server Error during MFA recovery' });
    }
};
// In backend/controllers/userController.js

// @desc    Verify MFA token during login and grant access
// @route   POST /api/users/mfa/login-verify
// @access  Public
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

// In backend/controllers/userController.js

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:token
// @access  Public
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
            message: 'Password reset successfully.'
        });

    } catch (error) {
        console.error('RESET PASSWORD ERROR:', error);
        res.status(500).json({ message: "There was an error resetting the password." });
    }
};

// In backend/controllers/userController.js

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};




// Export the function so we can use it in our routes
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    creatorDashboard,
    updatePassword,
    mfaSetup,
    mfaVerify,
    mfaLoginVerify, // Export the new function for MFA login verification
    forgotPassword, // Export the forgot password function
    resetPassword, // Export the reset password function
    mfaRecover,// Export the MFA recovery function
    verifyEmail, // Export the email verification function
    getUsers // Export the getUsers function



};