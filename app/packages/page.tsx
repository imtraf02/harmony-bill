"use client";

import {
	ArrowLeft,
	Check,
	Edit2,
	Package,
	Plus,
	Trash2,
	X,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {
	addMasterPackage,
	deleteMasterPackage,
	getMasterPackages,
	updateMasterPackage,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PackagesPage() {
	const [packages, setPackages] = React.useState<any[]>([]);
	const [newLabel, setNewLabel] = React.useState("");
	const [newPrice, setNewPrice] = React.useState<number>(0);
	const [editingId, setEditingId] = React.useState<string | null>(null);
	const [editLabel, setEditLabel] = React.useState("");
	const [editPrice, setEditPrice] = React.useState<number>(0);
	const [showAddForm, setShowAddForm] = React.useState(false);

	const loadPackages = async () => {
		const data = await getMasterPackages();
		setPackages(data);
	};

	React.useEffect(() => {
		loadPackages();
	}, []);

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newLabel) return;
		const res = await addMasterPackage(newLabel, newPrice);
		if (res.success) {
			setNewLabel("");
			setNewPrice(0);
			setShowAddForm(false);
			loadPackages();
		}
	};

	const handleUpdate = async (id: string) => {
		const res = await updateMasterPackage(id, editLabel, editPrice);
		if (res.success) {
			setEditingId(null);
			loadPackages();
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Bạn có chắc chắn muốn xoá gói này?")) {
			const res = await deleteMasterPackage(id);
			if (res.success) loadPackages();
		}
	};

	const startEdit = (pkg: any) => {
		setEditingId(pkg.id);
		setEditLabel(pkg.label);
		setEditPrice(pkg.price);
	};

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b sticky top-0 z-10">
				<div className="flex items-center gap-3 px-4 py-4 max-w-2xl mx-auto">
					<Link href="/">
						<Button variant="ghost" size="icon" className="shrink-0 -ml-2">
							<ArrowLeft className="w-5 h-5" />
						</Button>
					</Link>
					<h1 className="text-xl font-bold tracking-tight">Gói dịch vụ</h1>
					<span className="ml-auto text-sm font-medium text-muted-foreground bg-gray-100 rounded-full px-2.5 py-0.5">
						{packages.length}
					</span>
				</div>
			</div>

			<div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
				{/* Add new package - collapsed button or expanded form */}
				{!showAddForm ? (
					<button
						onClick={() => setShowAddForm(true)}
						className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
					>
						<Plus className="w-4 h-4" /> Thêm gói mới
					</button>
				) : (
					<div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 space-y-3">
						<div className="flex items-center justify-between mb-1">
							<p className="font-semibold text-sm">Gói mới</p>
							<Button
								size="icon"
								variant="ghost"
								className="w-7 h-7"
								onClick={() => setShowAddForm(false)}
							>
								<X className="w-4 h-4 text-muted-foreground" />
							</Button>
						</div>

						<form onSubmit={handleAdd} className="space-y-3">
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Tên gói
								</label>
								<Input
									value={newLabel}
									onChange={(e) => setNewLabel(e.target.value)}
									placeholder="VD: Gói Phóng Sự"
									autoFocus
								/>
							</div>
							<div className="space-y-1.5">
								<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									Giá tiền (₫)
								</label>
								<Input
									type="number"
									value={newPrice}
									onChange={(e) => setNewPrice(Number(e.target.value))}
									placeholder="0"
								/>
							</div>
							<Button
								type="submit"
								className="w-full gap-2 bg-rose-500 hover:bg-rose-600"
							>
								<Plus className="w-4 h-4" /> Thêm gói
							</Button>
						</form>
					</div>
				)}

				{/* Package list */}
				{packages.length === 0 ? (
					<div className="text-center py-16 text-muted-foreground">
						<Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
						<p className="font-medium">Chưa có gói dịch vụ nào</p>
						<p className="text-sm mt-1">Nhấn nút bên trên để thêm gói mới</p>
					</div>
				) : (
					packages.map((pkg) => (
						<div
							key={pkg.id}
							className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
						>
							{editingId === pkg.id ? (
								/* Edit mode */
								<div className="p-4 space-y-3">
									<div className="space-y-1.5">
										<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
											Tên gói
										</label>
										<Input
											value={editLabel}
											onChange={(e) => setEditLabel(e.target.value)}
											autoFocus
										/>
									</div>
									<div className="space-y-1.5">
										<label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
											Giá tiền (₫)
										</label>
										<Input
											type="number"
											value={editPrice}
											onChange={(e) => setEditPrice(Number(e.target.value))}
										/>
									</div>
									<div className="flex gap-2 pt-1">
										<Button
											className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
											onClick={() => handleUpdate(pkg.id)}
										>
											<Check className="w-4 h-4" /> Lưu
										</Button>
										<Button
											variant="outline"
											className="flex-1 gap-2"
											onClick={() => setEditingId(null)}
										>
											<X className="w-4 h-4" /> Huỷ
										</Button>
									</div>
								</div>
							) : (
								/* View mode */
								<div className="flex items-center px-4 py-3.5">
									<div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
										<Package className="w-4 h-4 text-rose-500" />
									</div>
									<div className="ml-3 flex-1 min-w-0">
										<p className="font-semibold text-sm truncate">
											{pkg.label}
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											{formatCurrency(pkg.price)}
										</p>
									</div>
									<div className="flex items-center gap-1 ml-2 shrink-0">
										<Button
											size="icon"
											variant="ghost"
											className="w-8 h-8 text-gray-400 hover:text-gray-700"
											onClick={() => startEdit(pkg)}
										>
											<Edit2 className="w-4 h-4" />
										</Button>
										<Button
											size="icon"
											variant="ghost"
											className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50"
											onClick={() => handleDelete(pkg.id)}
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}
