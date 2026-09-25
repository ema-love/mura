import { z } from "zod";

export const signInSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
});

export type SignInInput = z.infer<typeof signInSchema>;
