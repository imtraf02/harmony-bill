/**
 * components/bill-form.tsx
 * Main form component for capturing wedding photography contract details.
 * Updated to support dynamic packages and simplified event details.
 * UI redesigned: luxury / refined aesthetic — gold accents, serif typography, soft shadows.
 *
 * Uses html2canvas for better iOS capture support.
 * and waits for base64 images to be ready before triggering html-to-image capture.
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { captureElement } from "@/lib/capture";
import { CalendarIcon, Plus, Printer, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getMasterPackages, getSettings, saveContract } from "@/app/actions";


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { BillPreview } from "./bill-preview";

interface BillFormProps {
	onDataChange: (data: BillSchema) => void;
	initialData?: Partial<BillSchema>;
}

// Removed hardcoded studioInfo - now fetched from settings

/* ─────────────────────────────────────────
   Reusable section wrapper with gold rule
 ───────────────────────────────────────── */
function Section({
	title,
	children,
	action,
}: {
	title: string;
	children: React.ReactNode;
	action?: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-theme-border bg-white shadow-[0_2px_16px_0_rgba(180,150,80,0.07)] overflow-hidden">
			{/* Section header */}
			<div className="flex items-center justify-between p-2 bg-gradient-to-r from-theme-bg-muted to-white border-b border-theme-border">
				<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-theme-text-muted font-sans">
					{title}
				</span>
				{action}
			</div>
			<div className="p-2 space-y-4">{children}</div>
		</div>
	);
}

/* ─────────────────────────────────────────
   Elegant label component
 ───────────────────────────────────────── */
function ElegantLabel({
	htmlFor,
	children,
}: {
	htmlFor?: string;
	children: React.ReactNode;
}) {
	return (
		<label
			htmlFor={htmlFor}
			className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-theme-text-muted mb-1.5"
		>
			{children}
		</label>
	);
}

/* ─────────────────────────────────────────
   Styled input wrapper
 ───────────────────────────────────────── */
const inputCls =
	"w-full h-11 rounded-xl border border-theme-border-muted bg-theme-bg-body px-2 text-sm text-theme-text-dark placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-gold-primary/40 focus:border-theme-gold-primary transition-all duration-200";

export function BillForm({ onDataChange, initialData }: BillFormProps) {
	const [masterPackages, setMasterPackages] = React.useState<any[]>([]);
	const [settings, setSettings] = React.useState<any>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isDownloading, setIsDownloading] = React.useState(false);

	const form = useForm<BillSchema>({
		resolver: zodResolver(billSchema),
		defaultValues: {
			packages: [{ label: "", price: 0 }],
			travelFee: 0,
			discount: 0,
			incurredCost: 0,
			incurredCostReason: "",
			deposit: 0,
			includeVAT: false,
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

	React.useEffect(() => {
		if (initialData) {
			form.reset(initialData);
		}
	}, [initialData, form]);

	const values = watch();

	React.useEffect(() => {
		getMasterPackages().then(setMasterPackages);
		getSettings().then(setSettings);
	}, []);

	React.useEffect(() => {
		onDataChange(form.getValues() as BillSchema);
		const subscription = watch((value) => {
			onDataChange(value as BillSchema);
		});
		return () => subscription.unsubscribe();
	}, [watch, onDataChange, form]);

	const onDownloadImage = async () => {
		try {
			setIsDownloading(true);
			const safeName = (form.getValues().customerName || "khach-hang")
				.replace(/[^a-z0-9]/gi, "-")
				.toLowerCase();
			const todayStr = format(new Date(), "dd-MM-yyyy");

			await captureElement("bill-preview-content", `${todayStr}-${safeName}`);
			toast.success("Đã tạo file ảnh thành công!");
		} catch (err) {
			console.error("Lỗi tạo ảnh:", err);
			toast.error("Không thể tạo file ảnh.");
		} finally {
			setIsDownloading(false);
		}
	};

	const onSubmit = async (data: BillSchema) => {
		setIsSubmitting(true);
		try {
			const result = await saveContract(data);
			if (result.success) {
				toast.success("Hợp đồng đã được lưu thành công!");
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
	const subtotalBeforeDiscount = packageTotal + (Number(values.travelFee) || 0) + (Number(values.incurredCost) || 0);
	const subtotal = subtotalBeforeDiscount - (Number(values.discount) || 0);
	const vatAmount = values.includeVAT ? subtotal * 0.1 : 0;
	const totalPrice = subtotal + vatAmount;
	const remaining = totalPrice - (Number(values.deposit) || 0);

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);

	/* ── Date picker helper ── */
	function DatePicker({
		name,
		error,
	}: {
		name: "weddingDateStart" | "weddingDateEnd" | "pickupDate" | "contractDate";
		error?: any;
	}) {
		return (
			<Controller
				control={control}
				name={name}
				render={({ field }) => (
					<Popover>
						<PopoverTrigger
							render={
								<button
									type="button"
									className={cn(
										"w-full h-11 flex items-center rounded-xl border border-theme-border-muted bg-theme-bg-body px-2 text-sm text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme-gold-primary/40 focus:border-theme-gold-primary",
										!field.value && "text-theme-text-muted",
									)}
								/>
							}
						>
							<CalendarIcon className="mr-2 h-4 w-4 text-theme-gold-primary" />
							{field.value ? (
								<span className="text-theme-text-dark">
									{format(field.value, "dd/MM/yyyy")}
								</span>
							) : (
								<span>Chọn ngày</span>
							)}
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 shadow-xl border-theme-border rounded-2xl overflow-hidden">
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
		);
	}

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="space-y-2 pb-20 max-w-2xl mx-auto px-2"
		>
			{/* ── Studio Header ── */}
			<div className="rounded-2xl overflow-hidden shadow-[0_4px_24px_0_rgba(180,150,80,0.13)] border border-theme-border-muted">
				{/* Gold gradient banner */}
				<div className="h-1 w-full bg-gradient-to-r from-theme-gold-primary via-theme-gold-light to-theme-gold-primary" />
				<div className="bg-gradient-to-br from-theme-bg-body to-white p-2 text-center relative">
					{/* Studio name */}
					<div className="flex items-center justify-center gap-1 mb-1">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent to-theme-gold-primary/50" />
						<h1
							className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-theme-gold-hover"
						>
							{settings?.studioName || "HARMONY MEDIA"}
						</h1>
						<div className="h-px flex-1 bg-gradient-to-l from-transparent to-theme-gold-primary/50" />
					</div>

					<p className="text-[11px] tracking-[0.2em] uppercase text-theme-text-muted mb-3">
						Wedding Photography Studio
					</p>

					<div className="text-xs text-theme-text-muted space-y-1 mb-3">
						<p>{settings?.address || "Hòa Bình, Đông Hoà, Trảng Bom, Đồng Nai."}</p>
						<p>
							{settings?.email || "Studiohieutrancanon@gmail.com"}
							<span className="mx-2 text-theme-gold-primary">·</span>
							{settings?.phone || "0388.660.678"}
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-2">
						{(settings?.bankAccounts || [
							{ bank: "Sacombank", account: "050096596674", owner: "TRẦN QUỐC HIẾU" },
							{ bank: "MBBank", account: "0388660678", owner: "TRẦN QUỐC HIẾU" },
						]).map((acc: any, i: number) => (
							<div
								key={i}
								className="flex items-center gap-1.5 bg-theme-bg-muted border border-theme-border-muted rounded-lg px-3 py-1 text-[11px] text-theme-text-dark"
							>
								<span className="font-semibold text-theme-text-muted">{acc.bank}</span>
								<span className="text-theme-gold-primary">·</span>
								<span className="font-sans tracking-wide">{acc.account}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ── Customer Info ── */}
			<Section title="Thông tin khách hàng">
				<div>
					<ElegantLabel htmlFor="customerName">Tên khách hàng</ElegantLabel>
					<input
						id="customerName"
						placeholder="Nguyễn Văn A"
						className={inputCls}
						{...register("customerName")}
					/>
					{errors.customerName && (
						<p className="mt-1 text-xs text-red-500">
							{errors.customerName.message}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<div>
						<ElegantLabel htmlFor="phone">Số điện thoại</ElegantLabel>
						<input
							id="phone"
							placeholder="090xxxxxxx"
							type="tel"
							className={inputCls}
							{...register("phone")}
						/>
						{errors.phone && (
							<p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
						)}
					</div>

					<div>
						<ElegantLabel htmlFor="address">Địa chỉ</ElegantLabel>
						<input
							id="address"
							placeholder="Số nhà, đường, phường..."
							className={inputCls}
							{...register("address")}
						/>
						{errors.address && (
							<p className="mt-1 text-xs text-red-500">
								{errors.address.message}
							</p>
						)}
					</div>
				</div>
			</Section>

			{/* ── Packages ── */}
			<Section
				title="Danh sách gói dịch vụ"
				action={
					<button
						type="button"
						onClick={() => append({ label: "", price: 0 })}
						className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-theme-text-muted hover:text-theme-gold-hover border border-theme-border-muted hover:border-theme-gold-primary rounded-lg px-3 py-1 bg-white hover:bg-theme-bg-muted transition-all duration-200"
					>
						<Plus className="w-3.5 h-3.5" /> Thêm gói
					</button>
				}
			>
				<div className="space-y-3">
					{fields.map((field, index) => (
						<div key={field.id} className="relative rounded-xl group">
							<div className="flex items-start gap-1">
								<div className="flex-1 space-y-2">
									<div className="flex items-center justify-between">
										<ElegantLabel>Chọn gói {index + 1}</ElegantLabel>
										<button
											type="button"
											onClick={() => remove(index)}
											className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
										>
											<X className="w-3 h-3" /> Bỏ chọn
										</button>
									</div>
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
												<SelectTrigger className="w-full !h-[52px] rounded-xl border border-theme-border-muted bg-theme-bg-body px-2 text-sm text-theme-text-dark focus:ring-theme-gold-primary/40 focus:border-theme-gold-primary transition-all">
													<SelectValue placeholder="Bấm để chọn gói...">
														{(val: string) => {
															if (!val) return "Bấm để chọn gói...";
															const pkg = masterPackages.find(
																(p) => p.label === val,
															);
															if (!pkg) return val;
															return (
																<span className="flex flex-col items-start gap-0">
																	<span className="font-bold text-sm leading-tight">
																		{pkg.label}
																	</span>
																	<span className="text-[10px] text-theme-text-muted font-semibold">
																		{formatCurrency(pkg.price)}
																	</span>
																</span>
															);
														}}
													</SelectValue>
												</SelectTrigger>
												<SelectContent className="rounded-xl border-theme-border shadow-xl">
													<SelectGroup>
														{masterPackages.map((p) => (
															<SelectItem key={p.id} value={p.label}>
																<div className="flex flex-col items-start gap-0 py-1">
																	<span className="font-semibold text-sm">
																		{p.label}
																	</span>
																	<span className="text-[10px] opacity-70 font-medium">
																		{formatCurrency(p.price)}
																	</span>
																</div>
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									/>
								</div>
							</div>
						</div>
					))}
					{fields.length === 0 && (
						<div className="text-center py-8 border-2 border-dashed border-theme-border rounded-2xl text-theme-text-muted italic text-sm">
							Chưa có gói nào. Bấm "Thêm gói" để bắt đầu.
						</div>
					)}
				</div>
			</Section>

			{/* ── Wedding Details & Fees ── */}
			<Section title="Chi tiết ngày cưới & Phí">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<div>
						<ElegantLabel>Ngày bắt đầu</ElegantLabel>
						<DatePicker
							name="weddingDateStart"
							error={errors.weddingDateStart}
						/>
					</div>
					<div>
						<ElegantLabel>Ngày kết thúc</ElegantLabel>
						<DatePicker name="weddingDateEnd" error={errors.weddingDateEnd} />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<div>
						<ElegantLabel htmlFor="travelFee">Phí di chuyển (₫)</ElegantLabel>
						<input
							id="travelFee"
							type="number"
							inputMode="numeric"
							placeholder="0"
							className={inputCls}
							{...register("travelFee")}
						/>
					</div>
					<div>
						<ElegantLabel htmlFor="discount">Giảm giá (₫)</ElegantLabel>
						<input
							id="discount"
							type="number"
							inputMode="numeric"
							placeholder="0"
							className={inputCls}
							{...register("discount")}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
					<div>
						<ElegantLabel htmlFor="incurredCost">Chi phí phát sinh (₫)</ElegantLabel>
						<input
							id="incurredCost"
							type="number"
							inputMode="numeric"
							placeholder="0"
							className={inputCls}
							{...register("incurredCost")}
						/>
					</div>
					<div>
						<ElegantLabel htmlFor="incurredCostReason">Lý do phát sinh</ElegantLabel>
						<input
							id="incurredCostReason"
							placeholder="Lý do phát sinh..."
							className={inputCls}
							{...register("incurredCostReason")}
						/>
					</div>
				</div>

				<div>
					<ElegantLabel htmlFor="benefits">
						Quyền lợi khách hàng nhận được
					</ElegantLabel>
					<Textarea
						id="benefits"
						placeholder="Album + 100 ảnh rửa 13x18..."
						className="min-h-[90px] rounded-xl border-theme-border-muted bg-theme-bg-body text-sm text-theme-text-dark placeholder:text-theme-text-muted focus:ring-theme-gold-primary/40 focus:border-theme-gold-primary resize-none"
						{...register("benefits")}
					/>
					<div className="flex flex-wrap gap-1.5 mt-2">
						{[
							"Album bìa photobook kèm hộp 50 ảnh rửa 13x18",
							"Album bìa photobook kèm hộp 100 ảnh rửa 13x18",
							"Album + 100 ảnh rửa 13x18 + xe hoa (dưới 20km)",
							"Album + 50 ảnh rửa 13x18",
						].map((val, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => {
									const currentVal = watch("benefits") || "";
									setValue(
										"benefits",
										currentVal ? `${currentVal}\n${val}` : val,
									);
								}}
								className="text-[10px] border border-theme-border-muted rounded-lg px-2 py-1 bg-theme-bg-muted text-theme-gold-hover hover:bg-theme-border-muted hover:border-theme-gold-primary transition-colors leading-tight"
							>
								{val}
							</button>
						))}
					</div>
				</div>
			</Section>

			{/* ── Payment Summary ── */}
			<div className="rounded-2xl overflow-hidden border border-theme-border-muted shadow-[0_4px_24px_0_rgba(180,150,80,0.10)]">
				{/* Header */}
				<div className="flex items-center justify-between p-2 bg-gradient-to-r from-theme-bg-muted to-white border-b border-theme-border">
					<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-theme-text-muted">
						Thanh toán & Lịch hẹn
					</span>
					<label className="flex items-center gap-2 cursor-pointer select-none text-xs text-theme-text-muted font-medium">
						<input
							type="checkbox"
							id="includeVAT"
							className="w-4 h-4 rounded border-theme-border-muted accent-theme-gold-primary"
							{...register("includeVAT")}
						/>
						Tính VAT 10%
					</label>
				</div>

				<div className="bg-white p-2 space-y-5">
					{/* Summary numbers */}
					<div className="grid grid-cols-3 gap-1">
						{[
							{
								label: "Tạm tính",
								value: formatCurrency(subtotalBeforeDiscount),
								color: "text-theme-text-dark",
							},
							{
								label: "Giảm giá",
								value: `- ${formatCurrency(Number(values.discount) || 0)}`,
								color: "text-emerald-600",
							},
							{
								label: `Thuế ${values.includeVAT ? "10%" : "0%"}`,
								value: formatCurrency(vatAmount),
								color: "text-theme-text-dark",
							},
						].map((item) => (
							<div
								key={item.label}
								className="bg-theme-bg-body border border-theme-border rounded-xl p-1 text-center"
							>
								<p className="text-[10px] uppercase tracking-wider text-theme-text-muted mb-1">
									{item.label}
								</p>
								<p className={`text-xs font-bold ${item.color} leading-tight`}>
									{item.value}
								</p>
							</div>
						))}
					</div>

					{/* Total */}
					<div className="rounded-xl bg-gradient-to-r from-theme-bg-muted via-[#fdf9f0] to-theme-bg-muted border border-theme-border-muted p-2 flex items-center justify-between">
						<span className="text-[11px] uppercase tracking-[0.18em] font-bold text-theme-text-muted">
							Tổng cộng
						</span>
						<span
							className="text-2xl md:text-3xl font-black text-theme-gold-primary"
						>
							{formatCurrency(totalPrice)}
						</span>
					</div>

					{/* Deposit */}
					<div className="grid grid-cols-1 gap-4">
						<div>
							<ElegantLabel htmlFor="deposit">Tiền đặt cọc (₫)</ElegantLabel>
							<input
								id="deposit"
								type="number"
								inputMode="numeric"
								className={inputCls}
								{...register("deposit")}
							/>
							<div className="flex flex-wrap gap-1.5 mt-2">
								{[
									1_000_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000,
									6_000_000, 7_000_000, 8_000_000, 9_000_000
								].map((val) => (
									<button
										key={val}
										type="button"
										onClick={() => setValue("deposit", val)}
										className="text-[10px] border border-theme-border-muted rounded-lg px-2 py-1 bg-theme-bg-muted text-theme-gold-hover hover:bg-theme-border-muted hover:border-theme-gold-primary transition-colors font-medium"
									>
										{new Intl.NumberFormat("vi-VN").format(val)}
									</button>
								))}
							</div>
						</div>

						<div className="rounded-xl bg-theme-bg-body border border-theme-border p-3 flex items-center justify-between">
							<span className="text-[11px] uppercase tracking-[0.18em] font-bold text-theme-text-muted">
								Còn lại phải thu
							</span>
							<span className="text-2xl md:text-3xl font-black text-red-500">
								{formatCurrency(remaining)}
							</span>
						</div>
					</div>

					{/* Date pickers */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
						<div>
							<ElegantLabel>Ngày hẹn thanh toán</ElegantLabel>
							<DatePicker name="pickupDate" error={errors.pickupDate} />
						</div>
						<div>
							<ElegantLabel>Ngày lập hợp đồng</ElegantLabel>
							<DatePicker name="contractDate" error={errors.contractDate} />
						</div>
					</div>
				</div>
			</div>

			{/* ── Sticky Submit Bar ── */}
			<div className="fixed bottom-0 left-0 right-0 z-50 print:hidden">
				{/* Blur backdrop */}
				<div className="backdrop-blur-md bg-white/80 border-t border-theme-border p-2 flex gap-2 justify-center md:justify-end">
					<button
						type="button"
						onClick={onDownloadImage}
						disabled={isDownloading}
						className="flex-1 md:flex-none flex justify-center items-center gap-2 h-10 px-3 rounded-xl font-semibold text-[11px] md:text-sm text-theme-gold-hover bg-white border border-theme-border-muted hover:bg-theme-bg-muted transition-all shadow-sm disabled:opacity-60"
					>
						{isDownloading ? "Đang tạo..." : "TẢI ẢNH"}
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className={cn(
							"flex-1 md:flex-none flex justify-center items-center gap-2 h-10 px-4 rounded-xl font-bold text-[11px] md:text-sm tracking-wide text-white transition-all duration-200 shadow-lg",
							isSubmitting
								? "bg-theme-gold-primary/60 cursor-not-allowed"
								: "bg-gradient-to-r from-theme-gold-primary to-theme-gold-light hover:from-theme-gold-hover hover:to-theme-gold-hover shadow-theme-gold-primary/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
						)}
					>
						{isSubmitting ? (
							<span className="flex items-center gap-2">
								<svg
									className="animate-spin h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
									/>
								</svg>
								Đang lưu...
							</span>
						) : (
							<>
								<Printer className="w-4 h-4" />
								LƯU & IN
							</>
						)}
					</button>
				</div>
			</div>
		</form>
	);
}