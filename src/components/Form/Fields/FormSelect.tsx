import React from "react";
import { FieldValues, UseFormRegisterReturn } from "react-hook-form";
import { createListCollection } from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/Form/Fields/ui/select";
import FieldError, { FormErrorProps } from "./FormError";
interface CustomSelectProps<T> extends FormErrorProps {
  items: { value: string; label: string }[];
  registerReturn: UseFormRegisterReturn;
  name: keyof T;
  onChange: (value: string) => void;
  value: string | undefined;
}

const CustomSelect = <T extends FieldValues>({
  items,
  value,
  registerReturn,
  name,
  error,
  onChange,
}: CustomSelectProps<T>) => {
  const collection = createListCollection({ items });

  return (
    <div>
      <SelectRoot
        id={String(name)}
        {...registerReturn}
        collection={collection}
        value={value ? [value] : []}
        onValueChange={(e) => onChange(e.value[0])}
        variant={"subtle"}
      >
        <SelectLabel fontSize={16}>Select {String(name)}</SelectLabel>
        <SelectTrigger>
          <SelectValueText padding={2} placeholder={`Select Option`} />
        </SelectTrigger>
        <SelectContent padding={1}>
          {collection.items.map((item) => (
            <SelectItem key={item.value} padding={2} item={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <FieldError error={error} />
    </div>
  );
};

export default CustomSelect;
