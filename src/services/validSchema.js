import Joi from '@hapi/joi';

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] }
    }),

  username: Joi.string().trim().alphanum().min(3).max(30),

  password: Joi.string().trim().min(7).max(150).required()
}).xor('email', 'username');

export const tokenSchema = Joi.object({
  token: [Joi.string(), Joi.number()]
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
