import * as z from "zod";

export const intitalFormValues = {
  name: "",
  userName: "",
  habit: "",
  node: "",
};

export const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Min 3 letter required." })
      .max(20, { message: "Max 20 letters." }),
    userName: z.string().optional(),
    habit: z.string().optional(),
    node: z.string().min(1, { message: "Please select a node" }),
  })
  .superRefine((data, ctx) => {
    if (data.node === "usernode" && !data.userName) {
      ctx.addIssue({
        path: ["userName"],
        message: "Username is required for User Node.",
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.node === "habitnode" && !data.habit) {
      ctx.addIssue({
        path: ["habit"],
        message: "Habit is required for Habit Node.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type FormData = z.infer<typeof formSchema>;
