"use client";

import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	ChevronRight,
	Phone,
	Receipt,
	Search,
	Trash2,
	User,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { deleteContract, getContracts } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContractsPage() {
	const [contracts, setContracts] = React.useState<any[]>([]);
	const [searchTerm, setSearchTerm] = React.useState("");

	const loadContracts = async () => {
		const data = await getContracts();
		setContracts(data);
	};

	React.useEffect(() => {
		loadContracts();
	}, []);

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("Bạn có chắc chắn muốn xoá hợp đồng này?")) {
			const res = await deleteContract(id);
			if (res.success) {
				toast.success("Đã xoá hợp đồng");
				loadContracts();
			} else {
				toast.error("Lỗi: " + res.error);
			}
		}
	};

	const formatCurrency = (amount: any) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(Number(amount) || 0);

	const filteredContracts = contracts.filter(
		(c) =>
			c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			c.phone.includes(searchTerm),
	);

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
					<h1 className="text-xl font-bold tracking-tight">Lịch sử hợp đồng</h1>
					<span className="ml-auto text-sm font-medium text-muted-foreground bg-gray-100 rounded-full px-2.5 py-0.5">
						{filteredContracts.length}
					</span>
				</div>

				{/* Search bar */}
				<div className="px-4 pb-3 max-w-2xl mx-auto">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							placeholder="Tìm theo tên hoặc số điện thoại..."
							className="pl-9 bg-gray-50 border-gray-200"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* Contract list */}
			<div className="px-4 py-4 max-w-2xl mx-auto space-y-3">
				{filteredContracts.length === 0 ? (
					<div className="text-center py-16 text-muted-foreground">
						<Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
						<p className="font-medium">Không tìm thấy hợp đồng nào</p>
						<p className="text-sm mt-1">Thử tìm kiếm với từ khoá khác</p>
					</div>
				) : (
					filteredContracts.map((contract) => {
						const pkgTotal =
							contract.contract_packages?.reduce(
								(acc: number, p: any) => acc + Number(p.price),
								0,
							) || 0;
						const subtotalBeforeDiscount =
							pkgTotal + Number(contract.travel_fee);
						const subtotal =
							subtotalBeforeDiscount - (Number(contract.discount) || 0);
						const total = contract.include_vat ? subtotal * 1.1 : subtotal;

						return (
							<div
								key={contract.id}
								className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
							>
								{/* Card top: name + total */}
								<div className="flex items-start justify-between px-4 pt-4 pb-3">
									<div className="flex items-center gap-2.5 min-w-0">
										<div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
											<User className="w-4 h-4 text-rose-500" />
										</div>
										<div className="min-w-0">
											<p className="font-semibold text-sm leading-tight truncate">
												{contract.customer_name}
											</p>
											<p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
												<Phone className="w-3 h-3" /> {contract.phone}
											</p>
										</div>
									</div>
									<p className="font-bold text-sm text-rose-600 shrink-0 ml-2">
										{formatCurrency(total)}
									</p>
								</div>

								{/* Divider */}
								<div className="border-t border-dashed border-gray-100 mx-4" />

								{/* Card bottom: dates + action */}
								<div className="flex items-center justify-between px-4 py-3">
									<div className="flex gap-4 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<Calendar className="w-3 h-3" />
											Lập:{" "}
											{format(new Date(contract.contract_date), "dd/MM/yy")}
										</span>
										<span className="flex items-center gap-1">
											<Calendar className="w-3 h-3 text-rose-400" />
											Cưới:{" "}
											{format(
												new Date(contract.wedding_date_start),
												"dd/MM/yy",
											)}
										</span>
									</div>

									<Button
										size="icon"
										variant="ghost"
										className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50"
										onClick={(e) => handleDelete(contract.id, e)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
