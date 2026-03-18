import * as z from 'zod';

// registering user (Sign up)
const signUpParser = z.object({
    username: z.string().trim().max(50).optional(),
    email: z.string().email(),
    password: z.string(),
})

const loginParser = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string()
})


export {signUpParser, loginParser};