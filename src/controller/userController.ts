import { Request, Response } from "express";
import { generateOTP } from 'otp-gen-next';
import { User } from "../schema/User.js";
import sendOtp from "../helper/otpHelper.js";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
    const { mobileNo } = req.body;
    const otp = generateOTP(4, {
        numeric: true,
        alphabetic: false,
        upperCaseAlphabets: false,
        specialChars: false,
        excludeSimilarCharacters: false,
        excludeAmbiguousCharacters: false,

    });
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    try {
        let user = await User.findOne({ mobileNo });

        if (!user) {
            await User.create({
                mobileNo,
                otp,
                expiry,
                username: Date.now().toString()
            });
        } else {
            user.otp = otp;
            user.expiry = expiry;
            await user.save();
        }

        const response = await sendOtp(mobileNo, otp);

        console.log(response.data);
        res.status(200).json({ message: "otp sent sucessfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "otp send unsucessfully.", error: true });
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    console.log(req.body);

    try {
        const { mobileNo, otp } = req.body;

        const user = await User.findOne({ mobileNo });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.expiry < new Date()) return res.status(400).json({ message: "OTP expired" });

        user.otp = "";
        await user.save();

        const payload = {
            name: user.name,
            id: user._id,
        }

        if (user.isVerified) {
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
                expiresIn: "30d",
            });
            return res.json({ success: true, message: "OTP verified", token, verified: true, userId: user._id, name: user.name, publicKey: user.publicKey });
        }

        return res.json({ success: true, message: "OTP verified", token: null, verified: false });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: "Server error" });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { mobileNo, name, username, publicKey } = req.body;
    // console.log(req.body);

    if (!mobileNo || !name || !username || !publicKey) {
        return res.status(404).json({ error: true, message: "All fields are required" });
    }

    try {
        const oldUser = await User.findOne({ username: username });
        if (oldUser) {
            return res.status(404).json({ error: true, message: "username already exist." });
        }

        const user = await User.findOne({ mobileNo });

        if (!user) {
            return res.status(404).json({ error: true, message: "Invaid update request" });
        }

        user.name = name;
        user.isVerified = true;
        user.username = username;
        user.publicKey = publicKey;
        await user.save();

        const payload = {
            name,
            id: user._id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });
        return res.json({ success: true, message: "Profile Updated sucessfully", token, verified: true, userId: user._id, name });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: "Server error" });
    }
}