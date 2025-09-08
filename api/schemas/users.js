import z from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  user_name: z.string().min(1).max(100),
  password: z.string().min(6).max(20)
})