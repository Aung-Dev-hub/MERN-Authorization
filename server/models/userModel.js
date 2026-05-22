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