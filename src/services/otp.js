import crypto from 'crypto-random-string';

// Generates random 6 digit OTP
const generateOTP = () => {
  return crypto({ length: 6, type: 'distinguishable' });
};

export default generateOTP;
