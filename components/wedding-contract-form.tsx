"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { captureElement } from "@/lib/capture";
import { CalendarIcon, Plus, Printer, Settings, Trash2, X, ChevronDown, ChevronUp, Download } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getWeddingCombos, getSettings, saveWeddingContract } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Field,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { type WeddingContractSchema, weddingContractSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { WeddingContractPreview } from "./wedding-contract-preview";

interface WeddingContractFormProps {
	onDataChange: (data: WeddingContractSchema) => void;
	initialData?: Partial<WeddingContractSchema>;
}

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
			<div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#faf6ef] to-white border-b border-[#e8dcc8]">
				<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b49050]">
					{title}
				</span>
				{action}
			</div>
			<div className="p-4 space-y-4">{children}</div>
		</div>
	);
}

function ElegantLabel({ children }: { children: React.ReactNode }) {
	return (
		<label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8060] mb-1.5">
			{children}
		</label>
	);
}

const inputCls =
	"w-full h-11 rounded-xl border border-[#ddd0b8] bg-[#fdfbf8] px-3 text-sm text-[#2d2418] placeholder:text-[#c0aa88] focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/40 focus:border-[#c8a84b] transition-all duration-200";

export function WeddingContractForm({ onDataChange, initialData }: WeddingContractFormProps) {
	const [masterCombos, setMasterCombos] = React.useState<any[]>([]);
	const [settings, setSettings] = React.useState<any>(null);
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [isDownloading, setIsDownloading] = React.useState(false);

	const form = useForm<WeddingContractSchema>({
		resolver: zodResolver(weddingContractSchema),
		defaultValues: {
			combos: [],
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

	const { fields: comboFields, append: appendCombo, remove: removeCombo } = useFieldArray({
		control,
		name: "combos",
	});

	React.useEffect(() => {
		if (initialData) {
			form.reset(initialData);
		}
	}, [initialData, form]);

	const values = watch();

	React.useEffect(() => {
		getWeddingCombos().then(setMasterCombos);
		getSettings().then(setSettings);
	}, []);

	React.useEffect(() => {
		const subscription = watch((value) => {
			onDataChange(value as WeddingContractSchema);
		});
		return () => subscription.unsubscribe();
	}, [watch, onDataChange]);

	const addComboFromTemplate = (template: any) => {
		appendCombo({
			id: template.id,
			comboName: template.name,
			services: template.wedding_combo_services.map((s: any) => ({
				name: s.name,
				price: s.price,
				isRemoved: false,
				note: "",
			})),
		});
	};

	const onDownloadImage = async () => {
		try {
			setIsDownloading(true);
			const safeName = (form.getValues().customerName || "khach-hang")
				.replace(/[^a-z0-9]/gi, "-")
				.toLowerCase();
			const todayStr = format(new Date(), "dd-MM-yyyy");

			await captureElement("wedding-preview-content", `${todayStr}-${safeName}`);
			toast.success("Đã tạo file ảnh thành công!");
		} catch (err) {
			console.error("Lỗi tạo ảnh:", err);
			toast.error("Không thể tạo file ảnh.");
		} finally {
			setIsDownloading(false);
		}
	};

	const onSubmit = async (data: WeddingContractSchema) => {
		setIsSubmitting(true);
		try {
			const result = await saveWeddingContract(data);
			if (result.success) {
				toast.success("Hợp đồng cưới đã được lưu!");
				setTimeout(() => window.print(), 500);
			} else {
				toast.error("Lỗi: " + result.error);
			}
		} catch (error) {
			toast.error("Có lỗi xảy ra!");
		} finally {
			setIsSubmitting(false);
		}
	};

	const calculateComboTotal = (combo: any) => {
		return combo.services.reduce((acc: number, s: any) => {
			return acc + (s.isRemoved ? 0 : Number(s.price) || 0);
		}, 0);
	};

	const subtotalBeforeDiscount = (values.combos || []).reduce((acc, combo) => {
		return acc + calculateComboTotal(combo);
	}, 0) + (Number(values.travelFee) || 0);

	const subtotal = subtotalBeforeDiscount - (Number(values.discount) || 0);
	const vatAmount = values.includeVAT ? subtotal * 0.1 : 0;
	const totalPrice = subtotal + vatAmount;
	const remaining = totalPrice - (Number(values.deposit) || 0);

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pb-28 max-w-2xl mx-auto">
			{/* Studio Header (Reusable) */}
			<div className="rounded-2xl overflow-hidden shadow-[0_4px_24px_0_rgba(180,150,80,0.13)] border border-[#e0cc9a]">
				<div className="h-1 w-full bg-gradient-to-r from-[#c8a84b] via-[#e8d07a] to-[#c8a84b]" />
				<div className="bg-gradient-to-br from-[#fdfaf3] to-white p-6 text-center relative">
					<h1 className="text-2xl md:text-3xl font-bold tracking-[0.15em] text-[#8a6820]">
						{settings?.studioName || "HARMONY MEDIA"}
					</h1>
					<p className="text-[10px] tracking-[0.2em] uppercase text-[#b49050] mt-1">Wedding Photography & Services</p>
				</div>
			</div>

			<Section title="Thông tin khách hàng">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field>
						<ElegantLabel>Tên khách hàng (Người đặt)</ElegantLabel>
						<Input {...register("customerName")} placeholder="Nguyễn Văn A" className={inputCls} />
					</Field>
					<Field>
						<ElegantLabel>Số điện thoại</ElegantLabel>
						<Input {...register("phone")} placeholder="090..." className={inputCls} />
					</Field>
				</div>
				<Field>
					<ElegantLabel>Địa chỉ</ElegantLabel>
					<Input {...register("address")} placeholder="Địa chỉ liên hệ..." className={inputCls} />
				</Field>

			</Section>

			<Section title="Thông tin đám cưới">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field>
						<ElegantLabel>Ngày cưới</ElegantLabel>
						<Controller
							control={control}
							name="weddingDate"
							render={({ field }) => (
								<Popover>
									<PopoverTrigger
										render={
											<Button
												variant="outline"
												className={cn(
													"w-full h-11 justify-start text-left font-normal rounded-xl border-[#ddd0b8] bg-[#fdfbf8]",
													!field.value && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.value ? (
													format(field.value, "dd/MM/yyyy")
												) : (
													<span>Chọn ngày cưới</span>
												)}
											</Button>
										}
									/>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={vi} />
									</PopoverContent>
								</Popover>
							)}
						/>
					</Field>

				</div>
				<Field>
					<ElegantLabel>Ghi chú thêm</ElegantLabel>
					<Textarea {...register("notes")} placeholder="Ghi chú về yêu cầu đặc biệt..." className="rounded-xl border-[#ddd0b8] bg-[#fdfbf8]" />
				</Field>
			</Section>

			<Section 
				title="Combo dịch vụ" 
				action={
					<div className="flex gap-2">
						<Popover>
							<PopoverTrigger
								render={
									<Button
										size="sm"
										variant="outline"
										className="h-8 rounded-xl border-[#e0cc9a] text-[#b49050]"
									>
										<Plus className="w-3.5 h-3.5 mr-1" /> Thêm combo mẫu
									</Button>
								}
							/>
							<PopoverContent className="w-64 p-2 shadow-xl border-[#e8dcc8] rounded-2xl">
								<div className="space-y-1">
									{masterCombos.map(template => (
										<button
											key={template.id}
											type="button"
											onClick={() => addComboFromTemplate(template)}
											className="w-full text-left px-3 py-2 text-sm hover:bg-[#faf6ea] rounded-xl transition-colors flex flex-col"
										>
											<span className="font-bold text-[#5a3e1b]">{template.name}</span>
											<span className="text-[10px] text-[#9a8060]">{formatCurrency(template.base_price || 0)}</span>
										</button>
									))}
								</div>
							</PopoverContent>
						</Popover>
						<Button 
							type="button" 
							size="sm" 
							variant="outline" 
							className="h-8 rounded-xl border-[#e0cc9a] text-[#b49050]"
							onClick={() => appendCombo({ comboName: "Combo mới", services: [{ name: "", price: 0, isRemoved: false }] })}
						>
							<Plus className="w-3.5 h-3.5 mr-1" /> Combo thủ công
						</Button>
					</div>
				}
			>
				<div className="space-y-4">
					{comboFields.map((combo, comboIdx) => (
						<div key={combo.id} className="p-4 rounded-2xl border border-[#e8dcc8] bg-[#fdfbf8] relative group">
							<div className="flex items-center justify-between mb-3">
								<Input 
									{...register(`combos.${comboIdx}.comboName`)} 
									className="h-8 font-bold text-[#5a3e1b] bg-transparent border-none p-0 focus:ring-0 w-2/3" 
								/>
								<Button 
									type="button" 
									variant="ghost" 
									size="sm" 
									className="h-8 w-8 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50"
									onClick={() => removeCombo(comboIdx)}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>

							<div className="space-y-2">
								{values.combos?.[comboIdx]?.services?.map((service, serviceIdx) => (
									<div key={serviceIdx} className={cn("flex items-center gap-3 p-2 rounded-xl transition-all", service.isRemoved ? "opacity-40 bg-slate-100" : "bg-white border border-[#f0e8cc]")}>
										<input 
											type="checkbox" 
											checked={!service.isRemoved} 
											onChange={(e) => setValue(`combos.${comboIdx}.services.${serviceIdx}.isRemoved`, !e.target.checked)}
											className="w-4 h-4 rounded border-[#ddd0b8] accent-[#c8a84b]"
										/>
										<Input 
											{...register(`combos.${comboIdx}.services.${serviceIdx}.name`)} 
											placeholder="Tên dịch vụ" 
											className="h-8 text-xs bg-transparent border-none p-0 focus:ring-0 flex-1"
										/>
										<Input 
											type="number" 
											{...register(`combos.${comboIdx}.services.${serviceIdx}.price`, { valueAsNumber: true })} 
											className="h-8 w-24 text-xs text-right bg-transparent border-none p-0 focus:ring-0 font-semibold" 
										/>
									</div>
								))}
								<Button 
									type="button" 
									variant="ghost" 
									size="sm" 
									className="text-[10px] text-[#b49050] hover:text-[#8a6820]"
									onClick={() => {
										const currentServices = form.getValues(`combos.${comboIdx}.services`);
										setValue(`combos.${comboIdx}.services`, [...currentServices, { name: "", price: 0, isRemoved: false }]);
									}}
								>
									<Plus className="w-3 h-3 mr-1" /> Thêm dịch vụ vào combo
								</Button>
							</div>

							<div className="mt-4 pt-3 border-t border-dashed border-[#e8dcc8] flex justify-between items-center">
								<span className="text-[10px] uppercase font-bold text-[#9a8060]">Tổng combo</span>
								<span className="font-bold text-[#c8a84b]">{formatCurrency(calculateComboTotal(values.combos?.[comboIdx] || { services: [] }))}</span>
							</div>
						</div>
					))}
					{comboFields.length === 0 && (
						<div className="text-center py-8 border-2 border-dashed border-[#e8dcc8] rounded-2xl text-[#9a8060] italic text-sm">
							Chưa có combo nào. Bấm "Thêm combo mẫu" để bắt đầu.
						</div>
					)}
				</div>
			</Section>

			<Section title="Thanh toán & Phí">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field>
						<ElegantLabel>Phí di chuyển (₫)</ElegantLabel>
						<Input type="number" {...register("travelFee", { valueAsNumber: true })} className={inputCls} />
					</Field>
					<Field>
						<ElegantLabel>Giảm giá (₫)</ElegantLabel>
						<Input type="number" {...register("discount", { valueAsNumber: true })} className={inputCls} />
					</Field>
				</div>
				<div className="flex items-center justify-between p-4 bg-[#faf6ea] border border-[#e0cc9a] rounded-2xl">
					<div className="flex flex-col">
						<span className="text-[10px] uppercase font-bold text-[#9a8060]">Tổng cộng</span>
						<span className="text-2xl font-black text-[#c8a84b]">{formatCurrency(totalPrice)}</span>
					</div>
					<label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#8a6820]">
						<input type="checkbox" {...register("includeVAT")} className="w-4 h-4 accent-[#c8a84b]" />
						VAT 10%
					</label>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field>
						<ElegantLabel>Đặt cọc (₫)</ElegantLabel>
						<Input type="number" {...register("deposit", { valueAsNumber: true })} className={inputCls} />
					</Field>
					<div className="flex flex-col justify-center bg-[#fdfbf8] border border-[#e8dcc8] rounded-xl px-4 py-3">
						<span className="text-[10px] uppercase font-bold text-[#9a8060]">Còn lại</span>
						<span className="text-xl font-black text-red-500">{formatCurrency(remaining)}</span>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Field>
						<ElegantLabel>Ngày hẹn thanh toán</ElegantLabel>
						<Controller
							control={control}
							name="pickupDate"
							render={({ field }) => (
								<Popover>
									<PopoverTrigger
										render={
											<Button
												variant="outline"
												className={cn(
													"w-full h-11 justify-start text-left font-normal rounded-xl border-[#ddd0b8] bg-[#fdfbf8]",
													!field.value && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.value ? (
													format(field.value, "dd/MM/yyyy")
												) : (
													<span>Chọn ngày</span>
												)}
											</Button>
										}
									/>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={vi} />
									</PopoverContent>
								</Popover>
							)}
						/>
					</Field>
					<Field>
						<ElegantLabel>Ngày lập hợp đồng</ElegantLabel>
						<Controller
							control={control}
							name="contractDate"
							render={({ field }) => (
								<Popover>
									<PopoverTrigger
										render={
											<Button
												variant="outline"
												className={cn(
													"w-full h-11 justify-start text-left font-normal rounded-xl border-[#ddd0b8] bg-[#fdfbf8]",
													!field.value && "text-muted-foreground",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{field.value ? (
													format(field.value, "dd/MM/yyyy")
												) : (
													<span>Chọn ngày</span>
												)}
											</Button>
										}
									/>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={vi} />
									</PopoverContent>
								</Popover>
							)}
						/>
					</Field>
				</div>
			</Section>

			<div className="fixed bottom-0 left-0 right-0 z-50 no-print">
				<div className="backdrop-blur-md bg-white/80 border-t border-[#e8dcc8] px-4 py-3 flex justify-center gap-3 md:justify-end md:px-8">
					<Button 
						type="button"
						variant="outline"
						onClick={onDownloadImage}
						disabled={isDownloading}
						className="h-12 px-6 rounded-xl border-[#e0cc9a] text-[#8a6820] bg-white hover:bg-[#faf6ea] transition-all shadow-sm font-bold"
					>
						<Download className="w-4 h-4 mr-2" /> {isDownloading ? "Đang tạo..." : "TẢI FILE ẢNH"}
					</Button>
					<Button type="submit" disabled={isSubmitting} className="h-12 px-10 rounded-xl bg-gradient-to-r from-[#c8a84b] to-[#e8c84b] font-bold text-white shadow-lg">
						<Printer className="w-4 h-4 mr-2" /> {isSubmitting ? "Đang lưu..." : "LƯU & IN HỢP ĐỒNG CƯỚI"}
					</Button>
				</div>
			</div>
		</form>
	);
}
