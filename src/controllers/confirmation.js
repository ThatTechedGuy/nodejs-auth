import handleEmailVerification from './handleEmailVerification';
import sendEmailConfirmation from './sendEmailConfirmation';
import sendResetPasswordLink from './sendPasswordReset';
import handlePasswordReset from './handlePasswordReset';

const confirmation = {
  handleEmailVerification: handleEmailVerification,
  sendEmailConfirmation: sendEmailConfirmation,
  sendResetPasswordLink: sendResetPasswordLink,
  handlePasswordReset: handlePasswordReset
};

export default confirmation;
