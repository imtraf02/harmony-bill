/**
 * app/page.tsx
 * Main page hosting the BillForm and BillPreview in a responsive grid.
 */

"use client";

import { History } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { BillForm } from "@/components/bill-form";
import { BillPreview } from "@/components/bill-preview";
import { Button } from "@/components/ui/button";
import type { BillSchema } from "@/lib/schema";
import { cn, mapToBillSchema } from "@/lib/utils";
import { getContractById } from "@/app/actions";

function HomeContent() {
	const searchParams = useSearchParams();
	const editId = searchParams.get("edit");
	const [billData, setBillData] = React.useState<Partial<BillSchema>>({});
	const [initialData, setInitialData] = React.useState<Partial<BillSchema> | undefined>();

	React.useEffect(() => {
		if (editId) {
			getContractById(editId).then((contract) => {
				if (contract) {
					const mapped = mapToBillSchema(contract);
					setInitialData(mapped);
				}
			});
		}
	}, [editId]);

	return (
		<main className="min-h-screen bg-slate-50/50">
			<div className="container mx-auto py-10 px-4 md:px-8">
				<header className="mb-10 no-print flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight">
							Hợp đồng Quay phim & Chụp ảnh
						</h1>
						<p className="text-muted-foreground mt-2">
							{editId ? "Đang chỉnh sửa hợp đồng cũ." : "Điền thông tin bên dưới để tạo và in hợp đồng cho khách hàng."}
						</p>
					</div>
					<div className="flex gap-2">
						{editId && (
							<Button
								variant="ghost"
								render={<Link href="/" />}
							>
								Tạo mới
							</Button>
						)}
						<Button
							variant="outline"
							className="gap-2"
							nativeButton={false}
							render={<Link href="/contracts" />}
						>
							<History className="w-4 h-4" />
							Lịch sử hợp đồng
						</Button>
					</div>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
					{/* Left: Form */}
					<div className="no-print">
						<BillForm onDataChange={setBillData} initialData={initialData} />
					</div>

					{/* Right: Preview (Visible on screen and print) */}
					<div className="relative">
						<div className="lg:sticky lg:top-10">
							<div className="hidden lg:block no-print text-sm font-medium text-muted-foreground mb-4 text-center italic">
								Xem trước hợp đồng (Sẽ được in)
							</div>
							<BillPreview data={billData} />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export default function Home() {
	return (
		<React.Suspense fallback={<div>Đang tải...</div>}>
			<HomeContent />
		</React.Suspense>
	);
}
