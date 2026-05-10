"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldLabel,
	FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { type SettingsSchema, settingsSchema } from "@/lib/schema";

export default function SettingsPage() {
	const [isLoading, setIsLoading] = React.useState(false);

	const form = useForm<SettingsSchema>({
		resolver: zodResolver(settingsSchema),
		defaultValues: {
			studioName: "",
			address: "",
			email: "",
			phone: "",
			bankAccounts: [],
			backgroundUrl: "",
			signatureUrl: "",
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "bankAccounts",
	});

	const loadSettings = React.useCallback(async () => {
		setIsLoading(true);
		const data = await getSettings();
		if (data) {
			form.reset(data);
		}
		setIsLoading(false);
	}, [form]);

	React.useEffect(() => {
		loadSettings();
	}, [loadSettings]);

	const onSubmit = async (data: SettingsSchema) => {
		const res = await updateSettings(data);
		if (res.success) {
			toast.success("Đã lưu cài đặt thành công!");
		} else {
			toast.error("Lỗi: " + res.error);
		}
	};



	return (
		<div
			className="min-h-screen pb-20"
			style={{
				background: "linear-gradient(160deg, #fdfaf3 0%, #f5f0e8 100%)",
			}}
		>
			{/* ── Sticky Header ── */}
			<div
				className="sticky top-0 z-10"
				style={{
					background: "rgba(253, 250, 243, 0.92)",
					backdropFilter: "blur(12px)",
					borderBottom: "1px solid #e8dcc8",
				}}
			>
				<div className="flex items-center gap-3 px-4 py-4 max-w-2xl mx-auto">
					<Link href="/">
						<button className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#e0cc9a] bg-[#faf6ea] hover:bg-[#f0e8cc] text-[#b49050] transition-colors -ml-1">
							<ArrowLeft className="w-4 h-4" />
						</button>
					</Link>

					<div className="flex items-center gap-2.5 ml-1">
						<div className="h-5 w-px bg-[#e0cc9a]" />
						<h1 className="text-lg font-bold tracking-wide text-[#5a3e1b]">
							Cài đặt Studio
						</h1>
					</div>

					<div className="ml-auto flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="rounded-xl border-[#e0cc9a] text-[#b49050] h-9"
							nativeButton={false}
							render={<Link href="/packages" />}
						>
							Quản lý gói
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="rounded-xl border-[#e0cc9a] text-[#b49050] h-9"
							nativeButton={false}
							render={<Link href="/wedding-combos" />}
						>
							Quản lý combo cưới
						</Button>
						<Button
							onClick={form.handleSubmit(onSubmit)}
							className="h-9 rounded-xl bg-gradient-to-r from-[#c8a84b] to-[#e8c84b] text-white font-bold px-4"
						>
							<Save className="w-4 h-4 mr-2" /> Lưu
						</Button>
					</div>
				</div>
			</div>

			<div className="px-4 py-8 max-w-2xl mx-auto space-y-8">
				{/* ── Studio Info Section ── */}
				<div className="rounded-2xl border border-[#e0cc9a] bg-white shadow-[0_4px_20px_0_rgba(200,168,75,0.08)] overflow-hidden">
					<div className="px-5 py-3.5 bg-gradient-to-r from-[#faf6ef] to-white border-b border-[#e8dcc8]">
						<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b49050]">
							Thông tin cơ bản
						</span>
					</div>
					<div className="p-6 space-y-6">
						<FieldGroup>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Field>
									<FieldLabel>Tên Studio</FieldLabel>
									<Input {...form.register("studioName")} placeholder="HARMONY MEDIA" />
								</Field>
								<Field>
									<FieldLabel>Số điện thoại</FieldLabel>
									<Input {...form.register("phone")} placeholder="0388.660.678" />
								</Field>
							</div>

							<Field>
								<FieldLabel>Địa chỉ</FieldLabel>
								<Input {...form.register("address")} placeholder="Địa chỉ studio..." />
							</Field>

							<Field>
								<FieldLabel>Email</FieldLabel>
								<Input {...form.register("email")} placeholder="Email liên hệ..." />
							</Field>
						</FieldGroup>
					</div>
				</div>

				{/* ── Bank Accounts Section ── */}
				<div className="rounded-2xl border border-[#e0cc9a] bg-white shadow-[0_4px_20px_0_rgba(200,168,75,0.08)] overflow-hidden">
					<div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#faf6ef] to-white border-b border-[#e8dcc8]">
						<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b49050]">
							Tài khoản ngân hàng
						</span>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => append({ bank: "", account: "", owner: "" })}
							className="h-7 rounded-lg border-[#e0cc9a] text-[#b49050] text-[10px]"
						>
							<Plus className="w-3 h-3 mr-1" /> Thêm mới
						</Button>
					</div>
					<div className="p-6 space-y-4">
						{fields.map((field, index) => (
							<div
								key={field.id}
								className="p-4 rounded-2xl border border-[#e8dcc8] bg-[#fdfbf8] relative group transition-all hover:border-[#c8a84b] hover:bg-[#fff]"
							>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<Field>
										<FieldLabel className="text-[10px]">Ngân hàng</FieldLabel>
										<Input
											{...form.register(`bankAccounts.${index}.bank`)}
											placeholder="Sacombank"
											className="h-9 text-xs"
										/>
									</Field>
									<Field>
										<FieldLabel className="text-[10px]">Số tài khoản</FieldLabel>
										<Input
											{...form.register(`bankAccounts.${index}.account`)}
											placeholder="0500..."
											className="h-9 text-xs"
										/>
									</Field>
									<Field>
										<FieldLabel className="text-[10px]">Chủ tài khoản</FieldLabel>
										<Input
											{...form.register(`bankAccounts.${index}.owner`)}
											placeholder="TRẦN QUỐC HIẾU"
											className="h-9 text-xs"
										/>
									</Field>
								</div>
								<button
									type="button"
									onClick={() => remove(index)}
									className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border border-red-100 text-red-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
								>
									<Trash2 className="w-3.5 h-3.5" />
								</button>
							</div>
						))}
						{fields.length === 0 && (
							<div className="text-center py-6 text-[#9a8060] italic text-xs">
								Chưa có tài khoản ngân hàng nào.
							</div>
						)}
					</div>
				</div>

				{/* ── Images Section ── */}
				<div className="grid grid-cols-1 gap-6">
					<div className="rounded-2xl border border-[#e0cc9a] bg-white shadow-[0_4px_20px_0_rgba(200,168,75,0.08)] overflow-hidden">
						<div className="px-5 py-3.5 bg-gradient-to-r from-[#faf6ef] to-white border-b border-[#e8dcc8]">
							<span className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#b49050]">
								Hình ảnh Studio
							</span>
						</div>
						<div className="p-6 space-y-6">
							<Field>
								<FieldLabel>URL Hình nền (Background)</FieldLabel>
								<div className="flex gap-4 items-start">
									<div className="flex-1">
										<Input 
											{...form.register("backgroundUrl")} 
											placeholder="https://example.com/background.jpg" 
											className="h-10"
										/>
										<p className="mt-1.5 text-[10px] text-[#9a8060] italic">
											Nhập đường dẫn URL của hình nền sẽ hiển thị phía sau hợp đồng.
										</p>
									</div>
									{form.watch("backgroundUrl") && (
										<div className="w-20 h-20 rounded-xl border border-[#e0cc9a] overflow-hidden bg-[#faf6ea] flex-shrink-0">
											<img
												src={form.watch("backgroundUrl")}
												className="w-full h-full object-cover"
												alt="Background Preview"
												onError={(e) => {
													(e.target as HTMLImageElement).src = "https://placehold.co/400x600?text=Error";
												}}
											/>
										</div>
									)}
								</div>
							</Field>

							<Separator className="bg-[#f0e8cc]" />

							<Field>
								<FieldLabel>URL Chữ ký (Signature)</FieldLabel>
								<div className="flex gap-4 items-start">
									<div className="flex-1">
										<Input 
											{...form.register("signatureUrl")} 
											placeholder="https://example.com/signature.png" 
											className="h-10"
										/>
										<p className="mt-1.5 text-[10px] text-[#9a8060] italic">
											Nhập đường dẫn URL của chữ ký (nên sử dụng ảnh PNG trong suốt).
										</p>
									</div>
									{form.watch("signatureUrl") && (
										<div className="w-20 h-20 rounded-xl border border-[#e0cc9a] overflow-hidden bg-[#faf6ea] flex items-center justify-center p-2 flex-shrink-0">
											<img
												src={form.watch("signatureUrl")}
												className="max-w-full max-h-full object-contain"
												alt="Signature Preview"
												onError={(e) => {
													(e.target as HTMLImageElement).src = "https://placehold.co/200x100?text=Error";
												}}
											/>
										</div>
									)}
								</div>
							</Field>
						</div>
					</div>
				</div>

				<div className="flex justify-center pt-6">
					<Button
						onClick={form.handleSubmit(onSubmit)}
						className="h-12 w-full max-w-sm rounded-2xl bg-gradient-to-r from-[#c8a84b] to-[#e8c84b] hover:from-[#b49040] hover:to-[#d8b83b] text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
					>
						<Save className="w-5 h-5 mr-2" /> LƯU TẤT CẢ CÀI ĐẶT
					</Button>
				</div>
			</div>
		</div>
	);
}
