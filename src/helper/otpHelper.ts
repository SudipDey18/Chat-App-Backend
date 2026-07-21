import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.TEXTMEBOT_API_KEY || "";

const sendOtp = async (mobileNo: string, otp: string) => {
  const otp_template = `Hi user,
Your login OTP is: ${otp}
OTP is valid for 5 minutes.

Thank you for connecting with us.
- Team Chat App`;

  return await axios.get("https://api.textmebot.com/send.php", {
    params: {
      recipient: `91${mobileNo}`,
      apikey: apiKey,
      text: otp_template,
    },
  });
};

export default sendOtp;
