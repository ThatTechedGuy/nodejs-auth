// Generates random 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export default generateOTP;