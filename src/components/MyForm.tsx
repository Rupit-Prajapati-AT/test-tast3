"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button, Flex } from "@chakra-ui/react";
import { Node } from "reactflow";
import { useEffect } from "react";
import CustomSelect from "./CustomSelect";
import CustomInput from "./CustomInput";

const schema = z
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

export type FormData = z.infer<typeof schema>;

export interface MyFormProps {
  addNode: (data: FormData) => void;
  updateNode: (data: FormData) => void;
  editValues: Node | undefined;
  setEditValues: React.Dispatch<React.SetStateAction<Node | undefined>>;
}

const MyForm = ({
  addNode,
  updateNode,
  setEditValues,
  editValues,
}: MyFormProps) => {
  const intitalFormValues = { name: "", userName: "", habit: "", node: "" };
  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: editValues?.data || intitalFormValues,
  });

  const onSubmit = (data: FormData) => {
    const nodeType = selectedNode === "usernode" ? true : false;
    const newNodeData = {
      ...data,
      userName: nodeType ? data.userName : "",
      habit: !nodeType ? data.habit : "",
    };
    if (editValues) updateNode(newNodeData);
    else addNode(newNodeData);
    reset(intitalFormValues);
  };

  const handleReset = () => {
    setEditValues(undefined);
    reset(intitalFormValues);
  };

  useEffect(() => {
    if (editValues) reset(editValues.data);
  }, [editValues]);

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setValue(name, value);
  };

  const nodeOptions: { value: string; label: string }[] = [
    { value: "usernode", label: "User Node" },
    { value: "habitnode", label: "Habit Node" },
  ];
  const options: { value: string; label: string }[] = [
    { value: "exercise", label: "Exercise" },
    { value: "reading", label: "Reading" },
    { value: "meditation", label: "Meditation" },
  ];

  const selectedNode = watch("node");
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        maxWidth: 400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <CustomInput
        label="Name"
        registerReturn={register("name")}
        error={errors.name}
        name="name"
      />
      <CustomSelect
        value={watch("node")}
        registerReturn={register("node")}
        items={nodeOptions}
        name="node"
        error={errors.node}
        onChange={(value) => handleSelectChange("node", value)}
      />
      {selectedNode === "usernode" && (
        <CustomInput
          label="Username"
          registerReturn={register("userName")}
          error={errors.userName}
          name="userName"
        />
      )}
      {selectedNode === "habitnode" && (
        <CustomSelect
          value={watch("habit")}
          registerReturn={register("habit")}
          items={options}
          name="habit"
          error={errors.habit}
          onChange={(value) => handleSelectChange("habit", value)}
        />
      )}

      <Flex gap={2}>
        <Button
          variant={"subtle"}
          flexGrow={1}
          type="button"
          onClick={handleReset}
        >
          {editValues ? "Cancel" : "Reset"}
        </Button>
        <Button flexGrow={1} type="submit">
          {editValues ? "Update" : "Submit"}
        </Button>
      </Flex>
    </form>
  );
};

export default MyForm;
