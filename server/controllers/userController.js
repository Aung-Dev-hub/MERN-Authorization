import ErrorHandler from "../middleware/error.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";

// Register User Controller
export const register = catchAsyncError(async (req, res, next) => {
    try {

     // Get user data from request body
    const { name, email, password, phone, verificationMethod } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !phone || !verificationMethod) {
        return next(new ErrorHandler("All fields are required.", 400));
    }

    // Validate Myanmar phone number
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\+959\d{7,9}$/;
        return phoneRegex.test(phone);
    }
    if (!validatePhoneNumber(phone)) {
        return next(new ErrorHandler("Invalid phone number.", 400));
    }

    // Check existing verified user
    const existingUser = await User.findOne({
        $or: [
            {
                email: email,
                accountVerified: true,
            },
            {
                phone: phone,
                accountVerified: true,
            },
        ],
    });
    if (existingUser) {
        return next(
            new ErrorHandler("Phone or Email is already used.", 400)
        );
    }

    // Check registration attempts for unverified accounts
    const registrationAttemptsByUser = await User.find({
        $or: [
            {
                email: email,
                accountVerified: false,
            },
            {
                phone: phone,
                accountVerified: false,
            },
        ],
    });
    if (registrationAttemptsByUser.length > 3) {
        return next(
            new ErrorHandler(
                "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
                400
            )
        );
    }

    const userData = {name,email,password,phone};

    const user = await User.create(userData); 
    const verificationCode = await User.generateVerificationCode();
    await user.save();
    
    sendVerificationCode(verificationMethod,verificationCode,email,phone);
    res.status(200).json({
        success:true,
    });

    } catch (error) {next(error)};
});