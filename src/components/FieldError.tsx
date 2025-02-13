import React, { FC } from "react";
import { FieldError as FieldErrorType } from "react-hook-form";
export interface FieldErrorProps {
  error?: FieldErrorType;
}
const FieldError: FC<FieldErrorProps> = ({ error }) => {
  return (
    <>
      {error && (
        <span style={{ color: "red", fontSize: 14 }}>{error.message}</span>
      )}
    </>
  );
};

export default FieldError;
