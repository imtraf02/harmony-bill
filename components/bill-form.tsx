/**
 * components/bill-form.tsx
 * Main form component for capturing wedding photography contract details.
 * Updated to support dynamic packages and simplified event details.
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import * as htmlToImage from "html-to-image";
import { CalendarIcon, Plus, Printer, Settings, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getMasterPackages, saveContract } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type BillSchema, billSchema } from "@/lib/schema";
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
	const [masterPackages, setMasterPackages] = React.useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const form = useForm<BillSchema>({
		resolver: zodResolver(billSchema),
		defaultValues: {
			packages: [{ label: "", price: 0 }],
			travelFee: 0,
			discount: 0,
			deposit: 0,
			includeVAT: true,
			contractDate: new Date(),
		},
	});

	const {
		register,
		control,
		watch,
		setValue,
		formState: { errors },
	} = form;

	const { fields, append, remove } = useFieldArray({
		control,
		name: "packages",
	});

	const values = watch();

	// Load packages
	React.useEffect(() => {
		getMasterPackages().then(setMasterPackages);
	}, []);

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

	const onSubmit = async (data: BillSchema) => {
		setIsSubmitting(true);
		try {
			const result = await saveContract(data);
			if (result.success) {
				toast.success("Hợp đồng đã được lưu thành công!");
				
				// Generate image
				try {
					const element = document.getElementById("bill-preview-content");
					if (element) {
						// Use html-to-image with scale(1) to get full resolution
						const dataUrl = await htmlToImage.toJpeg(element, {
							quality: 0.95,
							pixelRatio: 2,
							style: {
								transform: 'scale(1)',
								transformOrigin: 'top left',
								marginBottom: '0'
							}
						});
						
						const link = document.createElement("a");
						const safeName = (data.customerName || "khach-hang").replace(/[^a-z0-9]/gi, '-').toLowerCase();
						link.download = `hop-dong-${safeName}.jpg`;
						link.href = dataUrl;
						link.click();
					}
				} catch (err) {
					console.error("Lỗi tạo ảnh:", err);
					toast.error("Đã lưu hợp đồng nhưng không thể tạo file ảnh.");
				}

				// Small delay to ensure the download starts before the print dialog blocks the UI
				setTimeout(() => {
					window.print();
				}, 500);
			} else {
				toast.error("Có lỗi xảy ra khi lưu hợp đồng: " + result.error);
			}
		} catch (error) {
			console.error(error);
			toast.error("Có lỗi xảy ra!");
		} finally {
			setIsSubmitting(false);
		}
	};

	const packageTotal = (values.packages || []).reduce(
		(acc, curr) => acc + (Number(curr.price) || 0),
		0,
	);
	const subtotalBeforeDiscount = packageTotal + (Number(values.travelFee) || 0);
	const subtotal = subtotalBeforeDiscount - (Number(values.discount) || 0);
	const vatAmount = values.includeVAT ? subtotal * 0.1 : 0;
	const totalPrice = subtotal + vatAmount;
	const remaining = totalPrice - (Number(values.deposit) || 0);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-24">
			{/* Studio Header (Read-only) */}
			<Card className="border-none shadow-none bg-muted/30">
				<CardHeader className="text-center p-4 relative">
					<Link
						href="/packages"
						className="absolute top-2 right-2 text-muted-foreground hover:text-primary print:hidden p-2"
						title="Quản lý gói"
					>
						<Settings className="w-5 h-5" />
					</Link>
					<CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-primary">
						{studioInfo.name}
					</CardTitle>
					<div className="text-xs md:text-sm text-muted-foreground space-y-1">
						<p>{studioInfo.address}</p>
						<p className="flex flex-col md:block">
							<span>Email: {studioInfo.email}</span>
							<span className="hidden md:inline"> | </span>
							<span>SĐT: {studioInfo.phone}</span>
						</p>
						<div className="flex flex-wrap justify-center gap-2 mt-2">
							{studioInfo.bankAccounts.map((acc, i) => (
								<p
									key={i}
									className="bg-background px-2 py-1 rounded border text-[10px] md:text-xs"
								>
									{acc.bank}: <span className="font-mono">{acc.account}</span>
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
								className="h-10 md:h-12 text-base md:text-sm"
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
									type="tel"
									className="h-10 md:h-12 text-base md:text-sm"
									{...register("phone")}
								/>
								<FieldError errors={[errors.phone]} />
							</Field>

							<Field data-invalid={!!errors.address}>
								<FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
								<Input
									id="address"
									placeholder="Số nhà, đường, phường..."
									className="h-10 md:h-12 text-base md:text-sm"
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
							onClick={() => append({ label: "", price: 0 })}
							className="gap-1 h-9 px-3"
						>
							<Plus className="w-4 h-4" /> Thêm gói
						</Button>
					</div>
					<FieldGroup className="space-y-4">
						{fields.map((field, index) => (
							<div
								key={field.id}
								className="relative group border p-3 md:p-4 rounded-lg bg-card/50"
							>
								<div className="grid grid-cols-1 gap-4">
									<Field data-invalid={!!errors.packages?.[index]?.label}>
										<FieldLabel>Chọn gói {index + 1}</FieldLabel>
										<Controller
											control={control}
											name={`packages.${index}.label`}
											render={({ field: selectField }) => (
												<Select
													value={selectField.value}
													onValueChange={(val) => {
														const pkg = masterPackages.find(
															(p) => p.label === val,
														);
														if (pkg) {
															setValue(`packages.${index}.label`, pkg.label);
															setValue(`packages.${index}.price`, pkg.price);
															setValue(`packages.${index}.id`, pkg.id);
														}
													}}
												>
													<SelectTrigger className="w-full h-10 md:h-12">
														<SelectValue placeholder="Bấm để chọn gói..." />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															{masterPackages.map((p) => (
																<SelectItem key={p.id} value={p.label}>
																	{p.label} - {formatCurrency(p.price)}
																</SelectItem>
															))}
														</SelectGroup>
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError errors={[errors.packages?.[index]?.label]} />
									</Field>

									{values.packages?.[index]?.price > 0 && (
										<div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md flex justify-between">
											<span>Đơn giá:</span>
											<span className="text-foreground">
												{formatCurrency(values.packages[index].price)}
											</span>
										</div>
									)}
								</div>
								{fields.length > 1 && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
										onClick={() => remove(index)}
									>
										<Trash2 className="w-4 h-4" />
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
					<FieldLegend>Chi tiết ngày cưới & Phí</FieldLegend>
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
															"w-full h-10 md:h-12 justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
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
															"w-full h-10 md:h-12 justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
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

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Field data-invalid={!!errors.travelFee}>
								<FieldLabel htmlFor="travelFee">Phí di chuyển (₫)</FieldLabel>
								<Input
									id="travelFee"
									type="number"
									inputMode="numeric"
									className="h-10 md:h-12 text-base md:text-sm"
									{...register("travelFee")}
								/>
								<FieldError errors={[errors.travelFee]} />
							</Field>

							<Field data-invalid={!!errors.discount}>
								<FieldLabel htmlFor="discount">Giảm giá (₫)</FieldLabel>
								<Input
									id="discount"
									type="number"
									inputMode="numeric"
									placeholder="0"
									className="h-10 md:h-12 text-base md:text-sm"
									{...register("discount")}
								/>
								<FieldError errors={[errors.discount]} />
							</Field>
						</div>

						<Field data-invalid={!!errors.benefits}>
							<FieldLabel htmlFor="benefits">
								Quyền lợi khách hàng nhận được
							</FieldLabel>
							<Textarea
								id="benefits"
								placeholder="Album + 100 ảnh rửa 13x18..."
								className="min-h-[100px] text-base md:text-sm"
								{...register("benefits")}
							/>
							<FieldError errors={[errors.benefits]} />
						</Field>
					</FieldGroup>
				</FieldSet>

				{/* Payment Summary */}
				<FieldSet className="bg-muted/50 p-4 md:p-6 rounded-lg border border-border/50">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
						<FieldLegend className="mb-0">Thanh toán & Lịch hẹn</FieldLegend>
						<div className="flex items-center gap-2 bg-background px-3 py-2 rounded-md border text-sm font-medium w-fit self-start md:self-auto">
							<input
								type="checkbox"
								id="includeVAT"
								className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
								{...register("includeVAT")}
							/>
							<label
								htmlFor="includeVAT"
								className="cursor-pointer select-none"
							>
								Tính thuế VAT (10%)
							</label>
						</div>
					</div>

					<FieldGroup>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left border-b pb-6 border-border/50">
							<Field className="col-span-1">
								<FieldLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
									Tạm tính
								</FieldLabel>
								<div className="text-base md:text-lg font-semibold">
									{formatCurrency(subtotalBeforeDiscount)}
								</div>
							</Field>

							<Field className="col-span-1">
								<FieldLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
									Giảm giá
								</FieldLabel>
								<div className="text-base md:text-lg font-semibold text-green-600">
									- {formatCurrency(Number(values.discount) || 0)}
								</div>
							</Field>

							<Field className="col-span-2 md:col-span-1">
								<FieldLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
									Thuế ({values.includeVAT ? "10%" : "0%"})
								</FieldLabel>
								<div className="text-base md:text-lg font-semibold">
									{formatCurrency(vatAmount)}
								</div>
							</Field>

							<Field className="col-span-2 pt-2">
								<FieldLabel className="text-xs uppercase tracking-widest text-primary font-bold">
									Tổng cộng sau cùng
								</FieldLabel>
								<div className="text-2xl md:text-3xl font-black text-primary">
									{formatCurrency(totalPrice)}
								</div>
							</Field>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
							<Field data-invalid={!!errors.deposit}>
								<FieldLabel htmlFor="deposit">Tiền đặt cọc (₫)</FieldLabel>
								<Input
									id="deposit"
									type="number"
									inputMode="numeric"
									className="h-10 md:h-12 text-base md:text-sm"
									{...register("deposit")}
								/>
								<FieldError errors={[errors.deposit]} />
							</Field>

							<Field>
								<FieldLabel>Còn lại phải thu</FieldLabel>
								<div className="text-xl md:text-2xl font-bold text-destructive">
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
															"w-full h-10 md:h-12 justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
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
															"w-full h-10 md:h-12 justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
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
				<Button
					size="lg"
					className="w-full md:w-auto h-12 md:h-10 gap-2 font-bold"
					type="submit"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						"Đang lưu..."
					) : (
						<>
							<Printer className="w-5 h-5 md:w-4 md:h-4" />
							LƯU & IN HỢP ĐỒNG
						</>
					)}
				</Button>
			</div>
		</form>
	);
}
