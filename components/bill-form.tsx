/**
 * components/bill-form.tsx
 * Main form component for capturing wedding photography contract details.
 * Updated to support dynamic packages and simplified event details.
 */

"use client";

import * as React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Printer, Plus, Trash2 } from "lucide-react";
import { vi } from "date-fns/locale";

import { billSchema, type BillSchema } from "@/lib/schema";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BillFormProps {
  onDataChange: (data: BillSchema) => void;
}

const studioInfo = {
  name: "HARMONY MEDIA",
  address: "Hòa Bình, Đông Hoà, Trảng Bom, Đồng Nai.",
  email: "Studiohieutrancanon@gmail.com",
  phone: "0388.660.678",
  bankAccounts: [
    { bank: "Sacombank", account: "050096596674", owner: "TRẦN QUỐC HIẾU" },
    { bank: "MBBank", account: "0388660678", owner: "TRẦN QUỐC HIẾU" },
  ],
};

export function BillForm({ onDataChange }: BillFormProps) {
  const form = useForm<BillSchema>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      packages: [{ label: "Gói 1", price: 0 }],
      travelFee: 0,
      deposit: 0,
      contractDate: new Date(),
    },
  });

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  const values = watch();

  // Sync form values to parent for preview
  React.useEffect(() => {
    // Initial sync
    onDataChange(form.getValues() as BillSchema);

    // Subscribe to changes
    const subscription = watch((value) => {
      onDataChange(value as BillSchema);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange, form]);

  const onSubmit = (data: BillSchema) => {
    console.log("Form submitted:", data);
    window.print();
  };

  const packageTotal = (values.packages || []).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const subtotal = packageTotal + (Number(values.travelFee) || 0);
  const vatAmount = subtotal * 0.1; // Assuming 10% VAT
  const totalPrice = subtotal + vatAmount;
  const remaining = totalPrice - (Number(values.deposit) || 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-20">
      {/* Studio Header (Read-only) */}
      <Card className="border-none shadow-none bg-muted/30">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">
            {studioInfo.name}
          </CardTitle>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{studioInfo.address}</p>
            <p>Email: {studioInfo.email} | SĐT: {studioInfo.phone}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {studioInfo.bankAccounts.map((acc, i) => (
                <p key={i} className="bg-background px-2 py-1 rounded border text-xs">
                  {acc.bank}: <span className="font-mono">{acc.account}</span> - {acc.owner}
                </p>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* Customer Info */}
        <FieldSet>
          <FieldLegend>Thông tin khách hàng</FieldLegend>
          <FieldGroup>
            <Field data-invalid={!!errors.customerName}>
              <FieldLabel htmlFor="customerName">Tên khách hàng</FieldLabel>
              <Input
                id="customerName"
                placeholder="Nguyễn Văn A"
                {...register("customerName")}
              />
              <FieldError errors={[errors.customerName]} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
                <Input
                  id="phone"
                  placeholder="090xxxxxxx"
                  {...register("phone")}
                />
                <FieldError errors={[errors.phone]} />
              </Field>

              <Field data-invalid={!!errors.address}>
                <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
                <Input
                  id="address"
                  placeholder="Số nhà, đường, phường..."
                  {...register("address")}
                />
                <FieldError errors={[errors.address]} />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        {/* Dynamic Packages */}
        <FieldSet>
          <div className="flex items-center justify-between">
            <FieldLegend>Danh sách gói dịch vụ</FieldLegend>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ label: `Gói ${fields.length + 1}`, price: 0 })}
              className="gap-1 h-8"
            >
              <Plus className="w-4 h-4" /> Thêm gói
            </Button>
          </div>
          <FieldGroup className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="relative group border p-4 rounded-lg bg-card/50">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                  <Field data-invalid={!!errors.packages?.[index]?.label}>
                    <FieldLabel>Tên gói {index + 1}</FieldLabel>
                    <Input
                      {...register(`packages.${index}.label` as const)}
                      placeholder="VD: Gói Chụp Phóng Sự"
                    />
                    <FieldError errors={[errors.packages?.[index]?.label]} />
                  </Field>

                  <Field data-invalid={!!errors.packages?.[index]?.price}>
                    <FieldLabel>Giá tiền (₫)</FieldLabel>
                    <Input
                      type="number"
                      {...register(`packages.${index}.price` as const)}
                      placeholder="0"
                    />
                    <FieldError errors={[errors.packages?.[index]?.price]} />
                  </Field>
                </div>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            {errors.packages?.root && (
              <FieldError errors={[errors.packages.root]} />
            )}
          </FieldGroup>
        </FieldSet>

        {/* Event Details */}
        <FieldSet>
          <FieldLegend>Chi tiết ngày cưới</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.weddingDateStart}>
                <FieldLabel>Ngày bắt đầu</FieldLabel>
                <Controller
                  control={control}
                  name="weddingDateStart"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          />
                        }
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError errors={[errors.weddingDateStart]} />
              </Field>

              <Field data-invalid={!!errors.weddingDateEnd}>
                <FieldLabel>Ngày kết thúc</FieldLabel>
                <Controller
                  control={control}
                  name="weddingDateEnd"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          />
                        }
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError errors={[errors.weddingDateEnd]} />
              </Field>
            </div>

            <Field data-invalid={!!errors.travelFee}>
              <FieldLabel htmlFor="travelFee">Phí di chuyển (₫)</FieldLabel>
              <Input
                id="travelFee"
                type="number"
                {...register("travelFee")}
              />
              <FieldError errors={[errors.travelFee]} />
            </Field>

            <Field data-invalid={!!errors.benefits}>
              <FieldLabel htmlFor="benefits">Quyền lợi khách hàng nhận được</FieldLabel>
              <Textarea
                id="benefits"
                placeholder="Album + 100 ảnh rửa 13x18..."
                className="min-h-[100px]"
                {...register("benefits")}
              />
              <FieldError errors={[errors.benefits]} />
            </Field>
          </FieldGroup>
        </FieldSet>

        {/* Payment Summary */}
        <FieldSet className="bg-muted p-6 rounded-lg border border-border/50">
          <FieldLegend>Thanh toán & Lịch hẹn</FieldLegend>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
              <Field>
                <FieldLabel>Tạm tính (Gói + Phí)</FieldLabel>
                <div className="text-lg font-semibold">
                  {formatCurrency(subtotal)}
                </div>
              </Field>

              <Field>
                <FieldLabel>Thuế GTGT (10%)</FieldLabel>
                <div className="text-lg font-semibold">
                  {formatCurrency(vatAmount)}
                </div>
              </Field>

              <Field>
                <FieldLabel>Tổng cộng (đã gồm thuế)</FieldLabel>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalPrice)}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.deposit}>
                <FieldLabel htmlFor="deposit">Tiền đặt cọc (₫)</FieldLabel>
                <Input
                  id="deposit"
                  type="number"
                  {...register("deposit")}
                />
                <FieldError errors={[errors.deposit]} />
              </Field>

              <Field>
                <FieldLabel>Còn lại</FieldLabel>
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(remaining)}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.pickupDate}>
                <FieldLabel>Ngày hẹn lấy sản phẩm</FieldLabel>
                <Controller
                  control={control}
                  name="pickupDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          />
                        }
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError errors={[errors.pickupDate]} />
              </Field>

              <Field data-invalid={!!errors.contractDate}>
                <FieldLabel>Ngày lập hợp đồng</FieldLabel>
                <Controller
                  control={control}
                  name="contractDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          />
                        }
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <FieldError errors={[errors.contractDate]} />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex justify-center md:justify-end md:px-8 z-50 print:hidden">
        <Button size="lg" className="w-full md:w-auto gap-2" type="submit">
          <Printer className="w-4 h-4" />
          Xuất PDF / In hợp đồng
        </Button>
      </div>
    </form>
  );
}
