const z = require("zod");

const SignUpRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const SignInRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = {
  SignUpRequestSchema,
  SignInRequestSchema,
};
