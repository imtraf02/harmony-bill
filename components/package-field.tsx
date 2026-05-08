/**
 * components/package-field.tsx
 * Reusable package row for label and price inputs.
 * Updated to support the nested packages array in BillSchema.
 */

"use client";

import { UseFormReturn, FieldPath } from "react-hook-form";
import { BillSchema } from "@/lib/schema";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface PackageFieldProps {
  form: UseFormReturn<BillSchema>;
  labelName: FieldPath<BillSchema>;
  priceName: FieldPath<BillSchema>;
  title: string;
}

export function PackageField({ form, labelName, priceName, title }: PackageFieldProps) {
  const {
    register,
    formState: { errors },
  } = form;

  // Helper to get nested error
  const getNestedError = (path: string) => {
    const parts = path.split(".");
    let current: any = errors;
    for (const part of parts) {
      if (!current) return undefined;
      current = current[part];
    }
    return current;
  };

  const labelError = getNestedError(labelName);
  const priceError = getNestedError(priceName);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field data-invalid={!!labelError}>
        <FieldLabel htmlFor={labelName}>{title}</FieldLabel>
        <Input
          id={labelName}
          placeholder="Tên gói (VD: 1 Chụp)"
          {...register(labelName)}
          aria-invalid={!!labelError}
        />
        <FieldError errors={[labelError]} />
      </Field>

      <Field data-invalid={!!priceError}>
        <FieldLabel htmlFor={priceName}>Giá tiền (₫)</FieldLabel>
        <Input
          id={priceName}
          type="number"
          placeholder="0"
          {...register(priceName)}
          aria-invalid={!!priceError}
        />
        <FieldError errors={[priceError]} />
      </Field>
    </div>
  );
}
