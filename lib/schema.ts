/**
 * lib/schema.ts
 * Zod schema for the wedding photography contract form.
 */

import { z } from "zod";

export const billSchema = z.object({
  // Customer info
  customerName: z.string().min(1, "Vui lòng nhập tên khách hàng"),
  phone: z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 chữ số)"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),

  // Dynamic Packages
  packages: z.array(z.object({
    label: z.string().min(1, "Tên gói không được để trống"),
    price: z.coerce.number().min(0),
  })).min(1, "Vui lòng thêm ít nhất một gói dịch vụ"),

  // Event details
  weddingDateStart: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu",
  }),
  weddingDateEnd: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
  }),
  travelFee: z.coerce.number().min(0),
  benefits: z.string().optional(),

  // Payment
  deposit: z.coerce.number().min(0),
  pickupDate: z.date({
    required_error: "Vui lòng chọn ngày hẹn lấy",
  }),
  contractDate: z.date({
    required_error: "Vui lòng chọn ngày lập hợp đồng",
  }),
});

export type BillSchema = z.infer<typeof billSchema>;
