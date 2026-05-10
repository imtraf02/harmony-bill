"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, Save, Trash2, Edit2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getWeddingCombos, addWeddingCombo, updateWeddingCombo, deleteWeddingCombo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { z } from "zod";

const comboTemplateSchema = z.object({
	name: z.string().min(1, "Vui lòng nhập tên combo"),
	description: z.string().optional(),
	basePrice: z.number().min(0),
	services: z.array(z.object({
		name: z.string().min(1, "Tên dịch vụ không được để trống"),
		price: z.number().min(0),
	})),
});

type ComboTemplate = z.infer<typeof comboTemplateSchema>;

export default function WeddingCombosPage() {
	const [combos, setCombos] = React.useState<any[]>([]);
	const [editingCombo, setEditingCombo] = React.useState<any | null>(null);
	const [isLoading, setIsLoading] = React.useState(true);

	const loadCombos = async () => {
		setIsLoading(true);
		const data = await getWeddingCombos();
		setCombos(data);
		setIsLoading(false);
	};

	React.useEffect(() => {
		loadCombos();
	}, []);

	const form = useForm<ComboTemplate>({
		resolver: zodResolver(comboTemplateSchema),
		defaultValues: {
			name: "",
			description: "",
			basePrice: 0,
			services: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "services",
	});

	const onSubmit = async (data: ComboTemplate) => {
		let res;
		if (editingCombo.isNew) {
			res = await addWeddingCombo(data);
		} else {
			res = await updateWeddingCombo(editingCombo.id, data);
		}

		if (res.success) {
			toast.success("Đã lưu mẫu combo thành công!");
			setEditingCombo(null);
			form.reset();
			loadCombos();
		} else {
			toast.error("Lỗi: " + res.error);
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Bạn có chắc chắn muốn xoá combo mẫu này?")) {
			const res = await deleteWeddingCombo(id);
			if (res.success) {
				toast.success("Đã xoá combo mẫu");
				loadCombos();
			} else {
				toast.error("Lỗi: " + res.error);
			}
		}
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("vi-VN").format(amount);

	return (
		<div className="min-h-screen pb-20 bg-slate-50/50">
			<div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#e8dcc8]">
				<div className="flex items-center gap-3 px-4 py-4 max-w-2xl mx-auto">
					<Button
						variant="outline"
						size="sm"
						className="w-9 h-9 p-0 rounded-xl flex items-center justify-center border border-[#e0cc9a] bg-[#faf6ea] text-[#b49050]"
						nativeButton={false}
						render={<Link href="/settings" />}
					>
						<ArrowLeft className="w-4 h-4" />
					</Button>
					<h1 className="text-lg font-bold text-[#5a3e1b]">Quản lý Combo Cưới</h1>
					<Button 
						onClick={() => {
							setEditingCombo({ isNew: true });
							form.reset({ name: "", description: "", basePrice: 0, services: [] });
						}}
						size="sm"
						className="ml-auto rounded-xl bg-[#c8a84b] text-white"
					>
						<Plus className="w-4 h-4 mr-1" /> Thêm mới
					</Button>
				</div>
			</div>

			<div className="px-4 py-8 max-w-2xl mx-auto space-y-6">
				{editingCombo ? (
					<div className="bg-white rounded-2xl border border-[#e8dcc8] p-6 shadow-sm">
						<h2 className="text-lg font-bold text-[#5a3e1b] mb-6">
							{editingCombo.isNew ? "Thêm Combo Mẫu Mới" : "Chỉnh sửa Combo Mẫu"}
						</h2>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<Field>
								<FieldLabel>Tên Combo</FieldLabel>
								<Input {...form.register("name")} placeholder="VD: Trọn gói Vàng" />
							</Field>
							<Field>
								<FieldLabel>Mô tả</FieldLabel>
								<Input {...form.register("description")} placeholder="Mô tả ngắn gọn..." />
							</Field>
							<Field>
								<FieldLabel>Giá tham khảo (₫)</FieldLabel>
								<Input type="number" {...form.register("basePrice", { valueAsNumber: true })} />
							</Field>

							<Separator />

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="text-sm font-bold text-[#9a8060] uppercase tracking-wider">Dịch vụ trong combo</h3>
									<Button 
										type="button" 
										variant="outline" 
										size="sm" 
										className="h-8 rounded-xl border-[#e0cc9a] text-[#b49050]"
										onClick={() => append({ name: "", price: 0 })}
									>
										<Plus className="w-3.5 h-3.5 mr-1" /> Thêm dịch vụ
									</Button>
								</div>

								{fields.map((field, index) => (
									<div key={field.id} className="flex gap-3 items-start">
										<Input {...form.register(`services.${index}.name`)} placeholder="Tên dịch vụ" className="flex-1" />
										<Input type="number" {...form.register(`services.${index}.price`, { valueAsNumber: true })} placeholder="Giá" className="w-32" />
										<Button 
											type="button" 
											variant="ghost" 
											size="sm" 
											className="h-10 w-10 text-red-500 hover:bg-red-50"
											onClick={() => remove(index)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								))}
							</div>

							<div className="flex gap-3 pt-6">
								<Button type="button" variant="ghost" className="flex-1 rounded-xl" onClick={() => setEditingCombo(null)}>Huỷ</Button>
								<Button type="submit" className="flex-1 rounded-xl bg-[#c8a84b] text-white">Lưu Combo</Button>
							</div>
						</form>
					</div>
				) : (
					<div className="space-y-4">
						{combos.map(combo => (
							<div key={combo.id} className="bg-white rounded-2xl border border-[#e8dcc8] p-5 shadow-sm group">
								<div className="flex justify-between items-start mb-2">
									<div>
										<h3 className="font-bold text-[#5a3e1b]">{combo.name}</h3>
										<p className="text-xs text-[#9a8060]">{combo.description}</p>
									</div>
									<p className="font-black text-[#c8a84b]">{formatCurrency(combo.base_price)}</p>
								</div>
								<div className="space-y-1 my-3">
									{combo.wedding_combo_services?.map((s: any) => (
										<div key={s.id} className="flex justify-between text-[11px] text-slate-500 italic">
											<span>• {s.name}</span>
											<span>{formatCurrency(s.price)}</span>
										</div>
									))}
								</div>
								<div className="flex justify-end gap-2 pt-3 border-t border-dashed border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button 
										variant="ghost" 
										size="sm" 
										className="h-8 rounded-xl text-[#b49050]"
										onClick={() => {
											setEditingCombo(combo);
											form.reset({
												name: combo.name,
												description: combo.description || "",
												basePrice: Number(combo.base_price) || 0,
												services: combo.wedding_combo_services.map((s: any) => ({ name: s.name, price: Number(s.price) }))
											});
										}}
									>
										<Edit2 className="w-3.5 h-3.5 mr-1" /> Sửa
									</Button>
									<Button 
										variant="ghost" 
										size="sm" 
										className="h-8 rounded-xl text-red-500"
										onClick={() => handleDelete(combo.id)}
									>
										<Trash2 className="w-3.5 h-3.5 mr-1" /> Xoá
									</Button>
								</div>
							</div>
						))}
						{combos.length === 0 && !isLoading && (
							<div className="text-center py-20 text-slate-400">Chưa có combo mẫu nào.</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
