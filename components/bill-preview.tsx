/**
 * components/bill-preview.tsx
 * Redesigned printable preview for A5 paper size.
 * Uses Roboto as the primary font for the entire bill.
 * Optimized for A5 printing with corrected signature alignment.
 */

"use client";

import { format } from "date-fns";
import {
	Calendar,
	Info,
	Landmark,
	Mail,
	MapPin,
	Phone,
	User,
} from "lucide-react";
import * as React from "react";
import type { BillSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface BillPreviewProps {
	data: Partial<BillSchema>;
}

export function BillPreview({ data }: BillPreviewProps) {
	const [scale, setScale] = React.useState(1);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const updateScale = () => {
			if (containerRef.current) {
				const containerWidth =
					containerRef.current.parentElement?.clientWidth || 0;
				if (containerWidth < 559) {
					setScale(containerWidth / 559);
				} else {
					setScale(1);
				}
			}
		};

		updateScale();
		window.addEventListener("resize", updateScale);
		return () => window.removeEventListener("resize", updateScale);
	}, []);

	const formatCurrency = (amount: number = 0) => {
		if (!amount) return "0";
		return new Intl.NumberFormat("vi-VN").format(amount);
	};

	const formatDate = (date?: Date) => {
		if (!date) return "";
		return format(date, "dd/MM/yyyy");
	};

	const packageTotal = (data.packages || []).reduce(
		(acc, curr) => acc + (Number(curr.price) || 0),
		0,
	);
	const subtotalBeforeDiscount = packageTotal + (Number(data.travelFee) || 0);
	const subtotal = subtotalBeforeDiscount - (Number(data.discount) || 0);
	const vatAmount = data.includeVAT ? subtotal * 0.1 : 0;
	const totalPrice = subtotal + vatAmount;
	const remaining = totalPrice - (Number(data.deposit) || 0);

	const today = new Date();
	const day = today.getDate().toString().padStart(2, "0");
	const month = (today.getMonth() + 1).toString().padStart(2, "0");
	const year = today.getFullYear();

	return (
		<div
			ref={containerRef}
			className="w-full flex justify-center overflow-hidden print:overflow-visible"
		>
			<style jsx global>{`
        @media print {
          @page {
            size: A5;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
			<div
				className={cn(
					"relative bg-white text-black shadow-2xl overflow-hidden",
					"print:shadow-none print:m-0 print:!transform-none print:w-[148mm] print:h-[210mm] print:fixed print:top-0 print:left-0 print:z-[10000]",
				)}
				style={{
					width: "559px",
					height: "794px",
					transform: `scale(${scale})`,
					transformOrigin: "top center",
					backgroundImage: 'url("/images/bg.jpg")',
					backgroundSize: "cover",
					backgroundPosition: "center",
					marginBottom: `calc(794px * (${scale} - 1))`,
				}}
			>
				{/* Decorative Corners */}
				<div
					className="absolute top-0 left-0 w-24 h-10 bg-primary/40 z-0"
					style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 40%)" }}
				></div>
				<div
					className="absolute top-0 left-0 w-8 h-24 bg-primary/40 z-0"
					style={{ clipPath: "polygon(0 0, 100% 0, 40% 80%, 0 100%)" }}
				></div>

				<div
					className="absolute bottom-0 right-0 w-32 h-32 bg-primary/40 z-0"
					style={{ clipPath: "polygon(100% 100%, 0 100%, 100% 0)" }}
				></div>
				<div
					className="absolute bottom-0 right-0 w-28 h-28 bg-black/40 z-0"
					style={{ clipPath: "polygon(100% 100%, 25% 100%, 100% 25%)" }}
				></div>

				<div className="relative z-10 p-5 md:p-6 flex flex-col h-full overflow-hidden">
					{/* Header */}
					<div className="flex justify-between items-start mb-2">
						<div className="flex items-center gap-2">
							<img src="/images/logo.png" alt="logo" className="h-12" />
						</div>
						<div className="text-right">
							<p className="text-[8px] font-black uppercase tracking-tight">
								Wedding Photography
							</p>
							<p className="text-[8px] font-bold uppercase tracking-tighter">
								Dịch vụ phóng sự cưới
							</p>
						</div>
					</div>

					{/* Title */}
					<div className="mb-2 flex justify-center">
						<div className="relative">
							<h2 className="text-xl font-black uppercase text-gray-900 px-2 tracking-tight">
								Hợp Đồng Chụp Ảnh Cưới
							</h2>
							<div className="absolute -bottom-1 left-0 w-full h-0.5 bg-black"></div>
						</div>
					</div>

					{/* Studio Info Section */}
					<div className="mb-3 grid grid-cols-[1.2fr_1fr] gap-3 bg-slate-50/80 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
						<div className="space-y-1 relative z-10">
							<h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
								<span className="w-3 h-0.5 bg-yellow-400 inline-block"></span>
								Thông tin Studio
							</h3>
							<div className="space-y-0.5 text-[8.5px] text-slate-600 font-medium leading-tight">
								<div className="flex items-center gap-2">
									<MapPin className="w-2.5 h-2.5 text-yellow-500 shrink-0" />
									<p>Hòa Bình, Đông Hoà, Trảng Bom, Đồng Nai.</p>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="w-2.5 h-2.5 text-yellow-500 shrink-0" />
									<p>Studiohieutrancanon@gmail.com</p>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="w-2.5 h-2.5 text-yellow-500 shrink-0" />
									<p className="font-semibold font-sans text-slate-900">
										0388.660.678
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-1 relative z-10 border-l border-slate-200 pl-3">
							<h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
								<Landmark className="w-2.5 h-2.5 text-yellow-500" />
								Thanh toán
							</h3>
							<div className="grid grid-cols-1 gap-1 text-[7.5px]">
								<div className="bg-white/60 p-1 rounded border border-slate-100 flex justify-between items-center">
									<div>
										<p className="font-bold text-yellow-700 uppercase text-[6.5px]">
											Sacombank
										</p>
										<p className="font-semibold font-sans text-slate-900 leading-none">
											050096596674
										</p>
									</div>
									<p className="text-[6.5px] text-slate-600 font-semibold uppercase">
										Trần Quốc Hiếu
									</p>
								</div>
								<div className="bg-white/60 p-1 rounded border border-slate-100 flex justify-between items-center">
									<div>
										<p className="font-bold text-yellow-700 uppercase text-[6.5px]">
											MBBank
										</p>
										<p className="font-semibold font-sans text-slate-900 leading-none">
											0388660678
										</p>
									</div>
									<p className="text-[6.5px] text-slate-600 font-semibold uppercase">
										Trần Quốc Hiếu
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Highlighted Customer Information Card */}
					<div className="mb-4 bg-white/40 backdrop-blur-md p-3 rounded-xl border-2 border-yellow-500/20 shadow-lg relative overflow-hidden">
						<div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-500/10 rounded-full"></div>

						<h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mb-3 flex items-center gap-2">
							<User className="w-3 h-3" />
							Thông tin khách hàng & Dịch vụ
							<div className="flex-1 h-[1px] bg-yellow-500/20"></div>
						</h3>

						<div className="space-y-2.5 text-[10px]">
							<div className="flex justify-between items-baseline border-b border-yellow-500/10 pb-1">
								<div className="flex items-center gap-2">
									<span className="uppercase font-black text-yellow-700 text-[8.5px]">
										Tên khách hàng:
									</span>
									<span className="font-medium text-slate-900">
										{data.customerName ||
											"......................................."}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="uppercase font-black text-yellow-700 text-[8.5px]">
										SĐT:
									</span>
									<span className="font-black text-slate-900">
										{data.phone || "................"}
									</span>
								</div>
							</div>

							<div className="border-b border-yellow-500/10 pb-1 flex items-center gap-2">
								<span className="uppercase font-black text-yellow-700 text-[8.5px]">
									Địa chỉ:
								</span>
								<span className="font-bold text-slate-800 flex-1">
									{data.address ||
										"..........................................................................."}
								</span>
							</div>

							<div className="space-y-2">
								{(data.packages || []).map((pkg, index) => (
									<div
										key={index}
										className="flex justify-between items-baseline border-b border-yellow-500/10 pb-1"
									>
										<div className="flex items-center gap-2">
											<span className="uppercase font-black text-yellow-700 text-[8.5px]">
												Đặt gói {index + 1}:
											</span>
											<span className="font-black text-yellow-800">
												{pkg.label || "......................................."}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="uppercase font-black text-yellow-700 text-[8.5px]">
												Chi phí:
											</span>
											<span className="font-black text-slate-900">
												{pkg.price ? formatCurrency(pkg.price) : "0"}
											</span>
										</div>
									</div>
								))}
							</div>

							<div className="flex justify-between items-baseline border-b border-yellow-500/10 pb-1">
								<div className="flex items-center gap-2">
									<Calendar className="w-2.5 h-2.5 text-yellow-600" />
									<span className="uppercase font-black text-yellow-700 text-[8.5px]">
										Ngày cưới:
									</span>
									<span className="font-black tracking-wider text-slate-900">
										{data.weddingDateStart
											? formatDate(data.weddingDateStart)
											: "../../...."}{" "}
										{data.weddingDateEnd
											? `- ${formatDate(data.weddingDateEnd)}`
											: ""}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="uppercase font-black text-yellow-700 text-[8.5px]">
										Phụ thu phí đi xa:
									</span>
									<span className="font-black text-slate-900">
										{data.travelFee ? formatCurrency(data.travelFee) : "0"}
									</span>
								</div>
							</div>

							<div className="flex items-start gap-2 pt-1">
								<Info className="w-2.5 h-2.5 text-yellow-600 shrink-0 mt-0.5" />
								<div>
									<span className="uppercase font-black text-yellow-700 text-[8.5px] block mb-0.5">
										Quyền lợi:
									</span>
									<p className="font-medium text-base leading-none">
										{data.benefits ||
											"..................................................."}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment and Signatures */}
					<div className="grid grid-cols-[1.1fr_1.1fr] gap-4">
						<div className="space-y-1.5 bg-slate-50/40 p-2.5 rounded-xl border border-slate-200 shadow-inner">
							<div className="flex items-center justify-between text-[9px]">
								<span className="uppercase font-black text-black">
									Tạm tính
								</span>
								<div className="font-black text-black">
									{formatCurrency(subtotalBeforeDiscount)}
								</div>
							</div>
							{Number(data.discount) > 0 && (
								<div className="flex items-center justify-between text-[9px]">
									<span className="uppercase font-black text-green-700">
										Giảm giá
									</span>
									<div className="font-black text-green-700">
										- {formatCurrency(Number(data.discount))}
									</div>
								</div>
							)}
							<div className="flex items-center justify-between text-[9px]">
								<span className="uppercase font-black text-black">
									Tổng chi phí
								</span>
								<div className="font-black text-black text-base">
									{formatCurrency(totalPrice)}
								</div>
							</div>
							{data.includeVAT && (
								<div className="flex items-center justify-between text-[9px]">
									<span className="uppercase font-black text-black">
										Thuế VAT (10%)
									</span>
									<div className="font-black text-black">
										{formatCurrency(vatAmount)}
									</div>
								</div>
							)}
							<div className="flex items-center justify-between text-[9px]">
								<span className="uppercase font-black text-black">Đặt cọc</span>
								<div className="font-black text-black">
									{formatCurrency(Number(data.deposit))}
								</div>
							</div>
							<div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px]">
								<span className="uppercase font-black text-black">Còn lại</span>
								<div className="font-black text-black text-lg">
									{formatCurrency(remaining)}
								</div>
							</div>
							<div className="flex items-center justify-between text-[9px]">
								<span className="uppercase font-black text-black">
									Ngày nhận
								</span>
								<div className="font-black text-black">
									{formatDate(data.pickupDate) || "../../...."}
								</div>
							</div>
						</div>

						<div className="flex flex-col">
							<div className="text-right mb-1">
								<p className="text-[8px] font-black text-slate-900 uppercase">
									NGÀY {day} THÁNG {month} NĂM {year}
								</p>
							</div>
							<div className="grid grid-cols-2 text-[8px] font-black text-center border-b border-slate-200/10 pb-1 mb-2">
								<span>KÍ TÊN KH</span>
								<span>BIÊN NHẬN</span>
							</div>
							<div className="grid grid-cols-2 flex-1 items-stretch">
								{/* Left side for KH signature */}
								<div className="border-r border-slate-100/10"></div>

								{/* Right side for Studio signature */}
								<div className="flex flex-col items-center justify-center relative min-h-[50px]">
									<div className="transform -rotate-6 absolute w-20 h-10">
										<img
											src="/images/sig.png"
											alt="Signature"
											className="w-full h-full object-contain opacity-80"
											onError={(e) => (e.currentTarget.style.display = "none")}
										/>
									</div>
									<div className="mt-auto pt-4 text-center">
										<p className="font-black text-[10px] underline decoration-1 underline-offset-2 tracking-tight text-slate-900">
											Trần Quốc Hiếu
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Footer Notes */}
					<div className="mt-auto text-[7.5px] leading-tight font-medium text-slate-600 border-t border-slate-100/50 pt-2">
						<p className="text-red-600 font-black mb-0.5 text-[8px]">LƯU Ý:</p>

						<ul className="space-y-0.5 uppercase tracking-tighter">
							<li>• Đọc kỹ quyền lợi khách hàng rồi hãy kí tên</li>
							<li>• Thay đổi ngày đột xuất chúng tôi không chịu trách nhiệm</li>
							<li>• Quý khách sẽ mất chi phí cọc nếu hủy</li>
						</ul>

						<div
							className={cn(
								"text-black font-black text-[10px] text-center mt-0.5 normal-case",
							)}
						>
							Chân thành cảm ơn quý khách!
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
