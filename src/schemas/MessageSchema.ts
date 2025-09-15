import z from "zod"

export const MessageSchema = z.object({
    content:z
          .string()
          .min(10,'Content must be of 10 characters')
          .max(200,"Content should not exceed these many characters")
})