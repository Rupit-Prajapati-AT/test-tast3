import React, { FC } from "react";
import { FieldError } from "react-hook-form";
export interface FormErrorProps {
  error?: FieldError;
}
const FormError: FC<FormErrorProps> = ({ error }) => {
  return (
    <>
      {error && (
        <span style={{ color: "red", fontSize: 14 }}>{error.message}</span>
      )}
    </>
  );
};

export default FormError;
