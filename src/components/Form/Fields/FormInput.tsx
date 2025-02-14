import { Input } from "@chakra-ui/react";
import React from "react";
import { FieldValues, UseFormRegisterReturn } from "react-hook-form";
import FormError, { FormErrorProps } from "./FormError";

export interface CustomInputProps<T> extends FormErrorProps {
  registerReturn: UseFormRegisterReturn;
  name: keyof T;
  label: string;
}
const CustomInput = <T extends FieldValues>({
  registerReturn,
  error,
  name,
  label,
}: CustomInputProps<T>) => {
  return (
    <div>
      <label htmlFor={String(name)}>{label}:</label>
      <Input
        id={String(name)}
        type="text"
        {...registerReturn}
        placeholder={`Enter your ${label}`}
        padding={2}
        variant={"subtle"}
        outline={"none"}
        border={"none"}
      />
      <FormError error={error} />
    </div>
  );
};

export default CustomInput;
