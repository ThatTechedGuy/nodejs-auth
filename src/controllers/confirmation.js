import handleEmailVerification from './handleEmailVerification';
import sendEmailConfirmation from './sendEmailConfirmation';
import sendResetPasswordLink from './sendPasswordReset';

const confirmation = {
  handleEmailVerification: handleEmailVerification,
  sendEmailConfirmation: sendEmailConfirmation,
  sendResetPasswordLink: sendResetPasswordLink
};

export default confirmation;
