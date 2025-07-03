// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true, // Every email must be unique
        lowercase: true, // Store emails in lowercase
    },
    role: {
        type: String,
        enum: ['customer', 'creator', 'admin'], // Define the possible roles
        default: 'customer', // Default role for new users
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8, // Enforce a minimum password length
    },
    // --- NEW FIELDS ---
    passwordChangedAt: Date,
    passwordHistory: [String], // An array to store old password hashes

    // --- NEW MFA FIELDS ---
    isMfaEnabled: {
        type: Boolean,
        default: false,
    },
    // This will store the final, confirmed MFA secret
    mfaSecret: {
        type: String,
    },
    // This will store a secret temporarily during the setup process
    mfaTempSecret: {
        type: String,
    },
    // --- NEW RECOVERY CODE FIELD ---
    mfaRecoveryCodes: {
        type: [String], // An array of strings
    },


    // --- NEW FORGOT PASSWORD FIELDS ---
    passwordResetToken: String,
    passwordResetExpires: Date,
    // --- NEW EMAIL VERIFICATION FIELDS ---
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: String,

    // --- NEW ACCOUNT LOCKOUT FIELDS ---
    failedLoginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
    },

},

    {
        // Automatically add 'createdAt' and 'updatedAt' fields
        timestamps: true
    });

// Instance method to compare passwords
// This function will be used to check if the provided password matches the stored hashed password
// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // If the password is being changed (not for a new user), add the old password to history
    if (!this.isNew) {
        // isNew is a Mongoose property that is true if the document is new
        this.passwordHistory.unshift(this._previousPassword); // Store the old password
        // Keep the history to a maximum of 5 recent passwords
        if (this.passwordHistory.length > 5) {
            this.passwordHistory.pop();
        }
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});
// We need a way to get the password before it gets hashed. We'll use another hook for that.
userSchema.pre('save', function (next) {
    if (this.isModified('password') && !this.isNew) {
        // Store the current password hash before it gets updated
        this._previousPassword = this.get('password', null, { getters: false });
    }
    next();
});
// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;