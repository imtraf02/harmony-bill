/**
 * components/bill-form.tsx
 * Main form component for capturing wedding photography contract details.
 * Updated to support dynamic packages and simplified event details.
 * UI redesigned: luxury / refined aesthetic — gold accents, serif typography, soft shadows.
 */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import * as htmlToImage from "html-to-image";
import { CalendarIcon, Plus, Printer, Settings, Trash2, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getMasterPackages, saveContract } from "@/app/actions";
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

interface BillFormProps {
	onDataChange: (data: BillSchema) => void;
	initialData?: Partial<BillSchema>;
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
		<div className="rounded-2xl border border-[#e8dcc8] bg-white shadow-[0_2px_16px_0_rgba(180,150,80,0.07)] overflow-hidden">
			{/* Section header */}
			<div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#faf6ef] to-white border-b border-[#e8dcc8]">
				<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b49050] font-sans">
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
			className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8060] mb-1.5"
		>
			{children}
		</label>
	);
}

/* ─────────────────────────────────────────
   Styled input wrapper
 ───────────────────────────────────────── */
const inputCls =
	"w-full h-11 rounded-xl border border-[#ddd0b8] bg-[#fdfbf8] px-2 text-sm text-[#2d2418] placeholder:text-[#c0aa88] focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/40 focus:border-[#c8a84b] transition-all duration-200";

export function BillForm({ onDataChange, initialData }: BillFormProps) {
	const [masterPackages, setMasterPackages] = React.useState<any[]>([]);
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const form = useForm<BillSchema>({
		resolver: zodResolver(billSchema),
		defaultValues: {
			packages: [{ label: "", price: 0 }],
			travelFee: 0,
			discount: 0,
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
			const element = document.getElementById("bill-preview-content");
			if (element) {
				const dataUrl = await htmlToImage.toJpeg(element, {
					quality: 0.95,
					pixelRatio: 2,
					style: {
						transform: "scale(1)",
						transformOrigin: "top left",
						marginBottom: "0",
					},
				});
				const link = document.createElement("a");
				const safeName = (form.getValues().customerName || "khach-hang")
					.replace(/[^a-z0-9]/gi, "-")
					.toLowerCase();
				link.download = `hop-dong-${safeName}.jpg`;
				link.href = dataUrl;
				link.click();
				toast.success("Đã tạo file ảnh thành công!");
			}
		} catch (err) {
			console.error("Lỗi tạo ảnh:", err);
			toast.error("Không thể tạo file ảnh.");
		}
	};

	const onSubmit = async (data: BillSchema) => {
		setIsSubmitting(true);
		try {
			const result = await saveContract(data);
			if (result.success) {
				toast.success("Hợp đồng đã được lưu thành công!");
				// Wait a bit for the UI to update if needed
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
										"w-full h-11 flex items-center rounded-xl border border-[#ddd0b8] bg-[#fdfbf8] px-2 text-sm text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/40 focus:border-[#c8a84b]",
										!field.value && "text-[#c0aa88]",
									)}
								/>
							}
						>
							<CalendarIcon className="mr-2 h-4 w-4 text-[#c8a84b]" />
							{field.value ? (
								<span className="text-[#2d2418]">
									{format(field.value, "dd/MM/yyyy")}
								</span>
							) : (
								<span>Chọn ngày</span>
							)}
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0 shadow-xl border-[#e8dcc8] rounded-2xl overflow-hidden">
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
			className="space-y-5 pb-28 max-w-2xl mx-auto"
			style={{ fontFamily: "'Outfit', 'Be Vietnam Pro', sans-serif" }}
		>
			{/* ── Studio Header ── */}
			<div className="rounded-2xl overflow-hidden shadow-[0_4px_24px_0_rgba(180,150,80,0.13)] border border-[#e0cc9a]">
				{/* Gold gradient banner */}
				<div className="h-1 w-full bg-gradient-to-r from-[#c8a84b] via-[#e8d07a] to-[#c8a84b]" />
				<div className="bg-gradient-to-br from-[#fdfaf3] to-white px-4 pt-4 pb-4 text-center relative">
					<Link
						href="/packages"
						className="absolute top-1 right-3 p-2 rounded-xl hover:bg-[#f5edd8] text-[#c8a84b] transition-colors print:hidden"
						title="Quản lý gói"
					>
						<Settings className="w-4 h-4" />
					</Link>

					{/* Studio name */}
					<div className="flex items-center justify-center gap-1 mb-1">
						<div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c8a84b]/50" />
						<h1
							className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-[#8a6820]"
							style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
						>
							{studioInfo.name}
						</h1>
						<div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c8a84b]/50" />
					</div>

					<p className="text-[11px] tracking-[0.2em] uppercase text-[#b49050] mb-3">
						Wedding Photography Studio
					</p>

					<div className="text-xs text-[#8a7550] space-y-1 mb-3">
						<p>{studioInfo.address}</p>
						<p>
							{studioInfo.email}
							<span className="mx-2 text-[#c8a84b]">·</span>
							{studioInfo.phone}
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-2">
						{studioInfo.bankAccounts.map((acc, i) => (
							<div
								key={i}
								className="flex items-center gap-1.5 bg-[#faf6ea] border border-[#e0cc9a] rounded-lg px-3 py-1 text-[11px] text-[#6b5530]"
							>
								<span className="font-semibold text-[#b49050]">{acc.bank}</span>
								<span className="text-[#c8a84b]">·</span>
								<span className="font-mono tracking-wide">{acc.account}</span>
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

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
							<p className="mt-1 text-xs text-red-500">
								{errors.phone.message}
							</p>
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
						className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#b49050] hover:text-[#8a6820] border border-[#e0cc9a] hover:border-[#c8a84b] rounded-lg px-3 py-1 bg-white hover:bg-[#faf6ea] transition-all duration-200"
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
										{values.packages?.[index]?.label && (
											<button
												type="button"
												onClick={() => {
													if (fields.length > 1) {
														remove(index);
													} else {
														setValue(`packages.${index}.label`, "");
														setValue(`packages.${index}.price`, 0);
														setValue(`packages.${index}.id`, undefined);
													}
												}}
												className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
											>
												<X className="w-3 h-3" /> Bỏ chọn
											</button>
										)}
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
												<SelectTrigger className="w-full !h-[52px] rounded-xl border border-[#ddd0b8] bg-[#fdfbf8] px-2 text-sm text-[#2d2418] focus:ring-[#c8a84b]/40 focus:border-[#c8a84b] transition-all">
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
																	<span className="text-[10px] text-[#9a8060] font-semibold">
																		{formatCurrency(pkg.price)}
																	</span>
																</span>
															);
														}}
													</SelectValue>
												</SelectTrigger>
												<SelectContent className="rounded-xl border-[#e8dcc8] shadow-xl">
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

							{fields.length > 1 && (
								<button
									type="button"
									onClick={() => remove(index)}
									className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100"
								>
									<Trash2 className="w-3 h-3" />
								</button>
							)}
						</div>
					))}
				</div>
			</Section>

			{/* ── Wedding Details & Fees ── */}
			<Section title="Chi tiết ngày cưới & Phí">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

				<div>
					<ElegantLabel htmlFor="benefits">
						Quyền lợi khách hàng nhận được
					</ElegantLabel>
					<Textarea
						id="benefits"
						placeholder="Album + 100 ảnh rửa 13x18..."
						className="min-h-[90px] rounded-xl border-[#ddd0b8] bg-[#fdfbf8] text-sm text-[#2d2418] placeholder:text-[#c0aa88] focus:ring-[#c8a84b]/40 focus:border-[#c8a84b] resize-none"
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
								className="text-[10px] border border-[#e0cc9a] rounded-lg px-2 py-1 bg-[#faf6ea] text-[#8a6820] hover:bg-[#f0e8cc] hover:border-[#c8a84b] transition-colors leading-tight"
							>
								{val}
							</button>
						))}
					</div>
				</div>
			</Section>

			{/* ── Payment Summary ── */}
			<div className="rounded-2xl overflow-hidden border border-[#e0cc9a] shadow-[0_4px_24px_0_rgba(180,150,80,0.10)]">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#faf6ef] to-white border-b border-[#e8dcc8]">
					<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b49050]">
						Thanh toán & Lịch hẹn
					</span>
					<label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#8a7550] font-medium">
						<input
							type="checkbox"
							id="includeVAT"
							className="w-4 h-4 rounded border-[#ddd0b8] accent-[#c8a84b]"
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
								color: "text-[#2d2418]",
							},
							{
								label: "Giảm giá",
								value: `- ${formatCurrency(Number(values.discount) || 0)}`,
								color: "text-emerald-600",
							},
							{
								label: `Thuế ${values.includeVAT ? "10%" : "0%"}`,
								value: formatCurrency(vatAmount),
								color: "text-[#2d2418]",
							},
						].map((item) => (
							<div
								key={item.label}
								className="bg-[#fdfbf8] border border-[#e8dcc8] rounded-xl p-1 text-center"
							>
								<p className="text-[10px] uppercase tracking-wider text-[#9a8060] mb-1">
									{item.label}
								</p>
								<p className={`text-xs font-bold ${item.color} leading-tight`}>
									{item.value}
								</p>
							</div>
						))}
					</div>

					{/* Total */}
					<div className="rounded-xl bg-gradient-to-r from-[#faf6ea] via-[#fdf9f0] to-[#faf6ea] border border-[#e0cc9a] px-5 py-4 flex items-center justify-between">
						<span className="text-[11px] uppercase tracking-[0.18em] font-bold text-[#b49050]">
							Tổng cộng
						</span>
						<span
							className="text-2xl md:text-3xl font-black text-[#c8a84b]"
							style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
						>
							{formatCurrency(totalPrice)}
						</span>
					</div>

					{/* Deposit */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
									6_000_000, 7_000_000,
								].map((val) => (
									<button
										key={val}
										type="button"
										onClick={() => setValue("deposit", val)}
										className="text-[10px] border border-[#e0cc9a] rounded-lg px-2 py-1 bg-[#faf6ea] text-[#8a6820] hover:bg-[#f0e8cc] hover:border-[#c8a84b] transition-colors font-medium"
									>
										{new Intl.NumberFormat("vi-VN").format(val)}
									</button>
								))}
							</div>
						</div>

						<div className="flex flex-col justify-center bg-[#fdfbf8] border border-[#e8dcc8] rounded-xl px-4 py-3">
							<p className="text-[10px] uppercase tracking-[0.18em] text-[#9a8060] mb-1">
								Còn lại phải thu
							</p>
							<p className="text-2xl font-black text-red-500">
								{formatCurrency(remaining)}
							</p>
						</div>
					</div>

					{/* Date pickers */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
				<div className="backdrop-blur-md bg-white/80 border-t border-[#e8dcc8] px-4 py-3 flex flex-wrap justify-center gap-3 md:justify-end md:px-8">
					<button
						type="button"
						onClick={onDownloadImage}
						className="flex items-center gap-2 h-12 px-5 rounded-xl font-semibold text-sm text-[#8a6820] bg-white border border-[#e0cc9a] hover:bg-[#faf6ea] transition-all shadow-sm"
					>
						TẢI FILE ẢNH
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className={cn(
							"flex items-center gap-2.5 h-12 px-8 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 shadow-lg",
							isSubmitting
								? "bg-[#c8a84b]/60 cursor-not-allowed"
								: "bg-gradient-to-r from-[#c8a84b] to-[#e8c84b] hover:from-[#b49040] hover:to-[#d8b83b] shadow-[#c8a84b]/30 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
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
								LƯU & IN HỢP ĐỒNG
							</>
						)}
					</button>
				</div>
			</div>
		</form>
	);
}
