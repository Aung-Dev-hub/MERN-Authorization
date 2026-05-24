import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userScheme = new mongoose.Schema({
    name: String,
    email: String,
    password: {
        name: String,
        minLength: [8, "Password must have at least 8 characters."],
        maxLengthL: [32, "Password cannot have more than 32 characters."],
    },
    phone: String,
    accountVerified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userScheme.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// User schema custom method for generating OTP / verification code
userSchema.methods.generateVerificationCode = function () {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainDigit = Math.floor(Math.random() * 10000)
            .toString() // Convert number to string
            .padStart(4, 0); 

        return parseInt(firstDigit + remainDigit);
    }

    const verificationCode = generateRandomFiveDigitNumber(); // Generate final verification code
    this.verificationCode = verificationCode; // Save verification code in database
    this.verificationCodeExpire = Date.now() + 5 * 60 * 1000; // Set OTP expire time (5 minutes)
    return verificationCode;
};


export const User = mongoose.model("User",userSchema);