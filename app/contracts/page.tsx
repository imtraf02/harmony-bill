"use client";

import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	ChevronRight,
	Download,
	Phone,
	Printer,
	Receipt,
	Search,
	Settings,
	Trash2,
	User,
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import Link from "next/link";
import * as React from "react";
import { deleteContract, getContracts } from "@/app/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BillPreview } from "@/components/bill-preview";
import { mapToBillSchema } from "@/lib/utils";

export default function ContractsPage() {
	const [contracts, setContracts] = React.useState<any[]>([]);
	const [searchTerm, setSearchTerm] = React.useState("");
	const [selectedContract, setSelectedContract] = React.useState<any | null>(null);

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
			c.phone.includes(searchTerm)
	);

	const onDownloadImage = async () => {
		if (!selectedContract) return;
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
				const safeName = (selectedContract.customer_name || "khach-hang")
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

	return (
		<div
			className="min-h-screen pb-20"
			style={{
				fontFamily: "'Outfit', 'Be Vietnam Pro', sans-serif",
				background: "linear-gradient(160deg, #fdfaf3 0%, #f5f0e8 100%)",
			}}
		>
			{/* ── Sticky Header ── */}
			<div
				className="sticky top-0 z-10 no-print"
				style={{
					background: "rgba(253, 250, 243, 0.92)",
					backdropFilter: "blur(12px)",
					borderBottom: "1px solid #e8dcc8",
				}}
			>
				{/* Top bar */}
				<div className="flex items-center gap-3 px-4 pt-4 pb-3 max-w-2xl mx-auto">
					<Link href="/">
						<button className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#e0cc9a] bg-[#faf6ea] hover:bg-[#f0e8cc] text-[#b49050] transition-colors -ml-1">
							<ArrowLeft className="w-4 h-4" />
						</button>
					</Link>

					<div className="flex items-center gap-2.5 ml-1">
						<div className="h-5 w-px bg-[#e0cc9a]" />
						<h1
							className="text-lg font-bold tracking-wide text-[#5a3e1b]"
							style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
						>
							Lịch sử hợp đồng
						</h1>
					</div>

					<div className="ml-auto flex items-center gap-1.5 bg-gradient-to-r from-[#c8a84b] to-[#e8c84b] text-white rounded-full px-3 py-1 shadow-sm">
						<span className="text-xs font-bold">{filteredContracts.length}</span>
						<span className="text-[10px] opacity-80">hợp đồng</span>
					</div>
				</div>

				{/* Search */}
				<div className="px-4 pb-3.5 max-w-2xl mx-auto">
					<div className="relative">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c8a84b]" />
						<input
							placeholder="Tìm theo tên hoặc số điện thoại..."
							className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#ddd0b8] bg-white/80 text-sm text-[#2d2418] placeholder:text-[#c0aa88] focus:outline-none focus:ring-2 focus:ring-[#c8a84b]/40 focus:border-[#c8a84b] transition-all"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* ── Contract list ── */}
			<div className="px-4 py-5 max-w-2xl mx-auto space-y-3 no-print">
				{filteredContracts.length === 0 ? (
					<div className="text-center py-20">
						<div className="w-16 h-16 rounded-2xl bg-[#faf6ea] border border-[#e8dcc8] flex items-center justify-center mx-auto mb-4">
							<Receipt className="w-7 h-7 text-[#c8a84b] opacity-50" />
						</div>
						<p className="font-semibold text-[#8a7550] text-sm">Không tìm thấy hợp đồng nào</p>
						<p className="text-xs text-[#b0a080] mt-1">Thử tìm kiếm với từ khoá khác</p>
					</div>
				) : (
					filteredContracts.map((contract, i) => {
						const pkgTotal =
							contract.contract_packages?.reduce(
								(acc: number, p: any) => acc + Number(p.price),
								0
							) || 0;
						const subtotalBeforeDiscount = pkgTotal + Number(contract.travel_fee);
						const subtotal = subtotalBeforeDiscount - (Number(contract.discount) || 0);
						const total = contract.include_vat ? subtotal * 1.1 : subtotal;
						const remaining = total - Number(contract.deposit || 0);

						return (
							<div
								key={contract.id}
								className="rounded-2xl border border-[#e8dcc8] bg-white overflow-hidden cursor-pointer group transition-all duration-200 hover:border-[#c8a84b] hover:shadow-[0_4px_20px_0_rgba(200,168,75,0.15)]"
								style={{ animationDelay: `${i * 40}ms` }}
								onClick={() => setSelectedContract(contract)}
							>
								{/* Gold accent line on hover */}
								<div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-[#c8a84b] via-[#e8d07a] to-[#c8a84b] transition-all duration-300" />

								{/* Main content */}
								<div className="flex items-start justify-between px-4 pt-4 pb-3">
									{/* Left: avatar + info */}
									<div className="flex items-center gap-3 min-w-0">
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#faf6ea] to-[#f0e8cc] border border-[#e0cc9a] flex items-center justify-center shrink-0">
											<User className="w-4 h-4 text-[#c8a84b]" />
										</div>
										<div className="min-w-0">
											<p
												className="font-semibold text-[#2d2418] text-sm leading-tight truncate"
												style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
											>
												{contract.customer_name}
											</p>
											<p className="text-[11px] text-[#9a8060] mt-0.5 flex items-center gap-1">
												<Phone className="w-3 h-3 text-[#c8a84b]" />
												{contract.phone}
											</p>
										</div>
									</div>

									{/* Right: amounts */}
									<div className="text-right shrink-0 ml-2">
										<p className="font-bold text-sm text-[#c8a84b]">
											{formatCurrency(total)}
										</p>
										<p className="text-[10px] text-[#9a8060] mt-0.5">
											Còn:{" "}
											<span className={remaining > 0 ? "text-red-500 font-semibold" : "text-emerald-600 font-semibold"}>
												{formatCurrency(remaining)}
											</span>
										</p>
									</div>
								</div>

								{/* Dashed divider */}
								<div className="border-t border-dashed border-[#e8dcc8] mx-4" />

								{/* Bottom row: dates + actions */}
								<div className="flex items-center justify-between px-4 py-2.5">
									<div className="flex gap-3 text-[11px] text-[#9a8060]">
										<span className="flex items-center gap-1">
											<Calendar className="w-3 h-3 text-[#c8a84b]" />
											Lập: {format(new Date(contract.contract_date), "dd/MM/yy")}
										</span>
										<span className="flex items-center gap-1">
											<Calendar className="w-3 h-3 text-[#e8a84b]" />
											Cưới: {format(new Date(contract.wedding_date_start), "dd/MM/yy")}
										</span>
									</div>

									{/* Action buttons */}
									<div className="flex items-center gap-0.5">
										<button
											className="flex items-center gap-1 text-[11px] font-semibold text-[#b49050] hover:text-[#8a6820] px-2.5 py-1.5 rounded-lg hover:bg-[#faf6ea] transition-colors"
											onClick={(e) => {
												e.stopPropagation();
												setSelectedContract(contract);
											}}
										>
											Xem
											<ChevronRight className="w-3 h-3" />
										</button>

										<Link href={`/?edit=${contract.id}`}>
											<button
												className="w-7 h-7 rounded-lg flex items-center justify-center text-[#7090c8] hover:bg-blue-50 transition-colors"
												onClick={(e) => e.stopPropagation()}
												title="Chỉnh sửa"
											>
												<Settings className="w-3.5 h-3.5" />
											</button>
										</Link>

										<button
											className="w-7 h-7 rounded-lg flex items-center justify-center text-[#b0a0a0] hover:text-red-500 hover:bg-red-50 transition-colors"
											onClick={(e) => handleDelete(contract.id, e)}
											title="Xoá"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</button>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* ── Preview Overlay ── */}
			{selectedContract && (
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setSelectedContract(null)}
					/>

					{/* Modal */}
					<div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col shadow-2xl no-print border border-[#e8dcc8]">
						{/* Modal header */}
						<div className="flex items-center justify-between px-5 py-4 border-b border-[#e8dcc8] bg-gradient-to-r from-[#faf6ef] to-white">
							<div className="flex items-center gap-2">
								<div className="h-4 w-px bg-[#c8a84b]" />
								<h2
									className="font-bold text-[#5a3e1b]"
									style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
								>
									Xem lại hợp đồng
								</h2>
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={onDownloadImage}
									className="flex items-center gap-1.5 text-xs font-semibold text-[#8a6820] border border-[#e0cc9a] rounded-xl px-3 py-2 bg-white hover:bg-[#faf6ea] transition-all"
								>
									<Download className="w-3.5 h-3.5" />
									Tải ảnh
								</button>
								<button
									onClick={() => window.print()}
									className="flex items-center gap-1.5 text-xs font-semibold text-[#b49050] border border-[#e0cc9a] rounded-xl px-3 py-2 bg-[#faf6ea] hover:bg-[#f0e8cc] hover:border-[#c8a84b] transition-all"
								>
									<Printer className="w-3.5 h-3.5" />
									In lại
								</button>
								<button
									onClick={() => setSelectedContract(null)}
									className="w-8 h-8 rounded-xl flex items-center justify-center border border-[#e0cc9a] bg-[#faf6ea] hover:bg-[#f0e8cc] text-[#b49050] transition-colors"
								>
									<ArrowLeft className="w-4 h-4 rotate-[270deg]" />
								</button>
							</div>
						</div>

						{/* Preview content */}
						<div className="flex-1 overflow-auto p-4 md:p-10 flex justify-center"
							style={{ background: "linear-gradient(160deg, #fdfaf3 0%, #f5f0e8 100%)" }}
						>
							<BillPreview data={mapToBillSchema(selectedContract)} />
						</div>
					</div>

					{/* Print only */}
					<div className="hidden print:block fixed inset-0 bg-white z-[10000]">
						<BillPreview data={mapToBillSchema(selectedContract)} />
					</div>
				</div>
			)}
		</div>
	);
}