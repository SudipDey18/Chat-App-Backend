import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const api_url = process.env.WP_API || "https://sudip-wp.zeabur.app";
const wp_user = process.env.WP_USERNAME || "root";
const wp_password = process.env.WP_PASSWORD || "root";


const sendOtp = async (mobileNo: string, otp: string) => {
    const otp_template = `
    *Hi user,*
    your login otp is: *${otp}*
    -otp valid only for 5 minute
    Thank you for connect with us,
           --team *chat-app*.
    `
    return await axios.post(
        `${api_url}/send/message`,
        {
            'phone': `91${mobileNo}@s.whatsapp.net`,
            'message': otp_template || "```Something went wrong in our server```",
            'is_forwarded': false,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username: wp_user,
                password: wp_password
            }
        }
    );
}

export default sendOtp