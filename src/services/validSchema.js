import Joi from '@hapi/joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    }),

  password: Joi.string().trim().min(7).max(150),

  token: [Joi.string(), Joi.number()]
})
  .xor('token', 'password')
  .xor('token', 'email')
  .with('email', 'password');

export const otpSchema = Joi.object({
  OTP: Joi.string().trim().alphanum().length(6).uppercase().required()
});

export const registerSchema = Joi.object({
  username: Joi.string().trim().alphanum().min(3).max(30).required(),
  fullName: Joi.string().trim().allow('').min(3).max(100).required(),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    })
    .required(),
  password: Joi.string().trim().min(7).max(150).required()
});

export const emailVerificationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    }),

  username: Joi.string().trim().alphanum().min(3).max(30)
}).xor('email', 'username');

export const passwordConfirmationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    })
    .required()
});

export const handlePasswordSchema = Joi.object({
  password: Joi.string().trim().min(7).max(150).required(),
  password2: Joi.ref('password'),
  OTP: Joi.string().trim().alphanum().length(6).uppercase().required()
}).with('password', 'password2');
