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





// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const { encrypt, decrypt } = require('../utils/encryptionService');

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, 'Please provide your name'],
//         get: decrypt
//     },
//     email: {
//         type: String,
//         required: [true, 'Please provide your email'],
//         unique: true,
//         lowercase: true,
//         get: decrypt
//     },
//     role: {
//         type: String,
//         enum: ['customer', 'creator', 'admin'],
//         default: 'customer',
//     },
//     password: {
//         type: String,
//         required: [true, 'A password is required'],
//         minlength: 8
//     },
//     isVerified: {
//         type: Boolean,
//         default: false
//     },
//     emailVerificationToken: String,
//     passwordChangedAt: Date,
//     passwordHistory: [String],
//     passwordResetToken: String,
//     passwordResetExpires: Date,
//     isMfaEnabled: {
//         type: Boolean,
//         default: false
//     },
//     mfaSecret: String,
//     mfaTempSecret: String,
//     mfaRecoveryCodes: {
//         type: [String]
//     },
//     failedLoginAttempts: {
//         type: Number,
//         default: 0
//     },
//     lockUntil: Date,
// }, {
//     timestamps: true,
//     // These options are crucial for the 'getters' to work automatically
//     toJSON: { getters: true },
//     toObject: { getters: true }
// });

// // --- COMBINED PRE-SAVE MIDDLEWARE ---
// userSchema.pre('save', async function (next) {
//     // --- 1. Encrypt name and email if they have been modified ---
//     if (this.isModified('name')) {
//         // Use .set() to bypass the 'decrypt' getter when setting an already plain-text value.
//         // this.get('name', null, { getters: false }) ensures we get the raw, un-decrypted value to re-encrypt.
//         this.set('name', encrypt(this.get('name', null, { getters: false })), { strict: false });
//     }
//     if (this.isModified('email')) {
//         this.set('email', encrypt(this.get('email', null, { getters: false })), { strict: false });
//     }

//     // --- 2. Handle password hashing if it has been modified ---
//     if (this.isModified('password')) {
//         // Add the previous password to history if this is an existing user
//         if (!this.isNew) {
//             const user = await this.constructor.findOne({ _id: this._id });
//             if (user && user.password) {
//                 this.passwordHistory.unshift(user.password);
//                 if (this.passwordHistory.length > 5) {
//                     this.passwordHistory.pop();
//                 }
//             }
//         }
//         const salt = await bcrypt.genSalt(12);
//         this.password = await bcrypt.hash(this.password, salt);
//     }

//     next();
// });

// // Instance method to compare passwords for login
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);
// module.exports = User;