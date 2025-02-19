const zod = require("zod");

const createUser = zod.object({
  username: zod.string().email(),
  password: zod.string().min(8).max(16),
  firstname: zod.string(),
  lastname: zod.string(),
});

const loginUser = zod
  .object({
    username: zod.string().email(),
    password: zod.string(),
  })
  .strict();

const updateUser = zod.object({
  password: zod.string().optional(),
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
});

module.exports = { createUser, loginUser, updateUser };
