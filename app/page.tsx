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
import { WeddingContractForm } from "@/components/wedding-contract-form";
import { WeddingContractPreview } from "@/components/wedding-contract-preview";
import { Button } from "@/components/ui/button";
import type { BillSchema, WeddingContractSchema } from "@/lib/schema";
import { cn, mapToBillSchema, mapToWeddingSchema } from "@/lib/utils";
import { getContractById, getWeddingContractById, getSettings } from "@/app/actions";
import type { SettingsSchema } from "@/lib/schema";
import { Camera, Heart, Settings } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

function HomeContent() {
	const searchParams = useSearchParams();
	const editId = searchParams.get("edit");
	const tabParam = searchParams.get("tab") || "photo";

	const [activeTab, setActiveTab] = React.useState<"photo" | "wedding">(tabParam as any);
	const [billData, setBillData] = React.useState<Partial<BillSchema>>({});
	const [weddingData, setWeddingData] = React.useState<Partial<WeddingContractSchema>>({});

	const [initialData, setInitialData] = React.useState<Partial<BillSchema> | undefined>();
	const [weddingInitialData, setWeddingInitialData] = React.useState<Partial<WeddingContractSchema> | undefined>();
	const [settings, setSettings] = React.useState<SettingsSchema | undefined>();

	React.useEffect(() => {
		getSettings().then((s) => setSettings(s || undefined));
		if (editId) {
			if (tabParam === "wedding") {
				getWeddingContractById(editId).then((contract) => {
					if (contract) {
						const mapped = mapToWeddingSchema(contract);
						setWeddingInitialData(mapped);
						setActiveTab("wedding");
					}
				});
			} else {
				getContractById(editId).then((contract) => {
					if (contract) {
						const mapped = mapToBillSchema(contract);
						setInitialData(mapped);
						setActiveTab("photo");
					} else {
						// Try fetching wedding contract if photo contract not found
						getWeddingContractById(editId).then((wc) => {
							if (wc) {
								const mapped = mapToWeddingSchema(wc);
								setWeddingInitialData(mapped);
								setActiveTab("wedding");
							}
						});
					}
				});
			}
		}
	}, [editId, tabParam]);

	// Sync active tab with search param (only if not editing, or if editing and it's initial load)
	React.useEffect(() => {
		if (!editId && (tabParam === "wedding" || tabParam === "photo")) {
			setActiveTab(tabParam as any);
		}
	}, [tabParam, editId]);

	const updateTab = (tab: "photo" | "wedding") => {
		setActiveTab(tab);
		const url = new URL(window.location.href);
		url.searchParams.set("tab", tab);
		window.history.pushState({}, "", url);
	};

	return (
		<main className="min-h-screen bg-theme-bg-body pb-24">
			<div className="container mx-auto p-2">
				<header className="mb-6 no-print space-y-4 md:space-y-0 md:flex md:items-center md:justify-between relative">
					{/* Hàng 1 trên mobile: Logo + Actions */}
					<div className="flex items-center justify-between">
						<h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-theme-text-dark">
							Harmony Bill
						</h1>
						<div className="flex items-center gap-1.5 md:hidden">
							{editId && (
								<Button variant="ghost" size="sm" onClick={() => window.location.href = "/"}>
									Mới
								</Button>
							)}
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-xl border-theme-border-muted text-theme-text-muted"
								nativeButton={false}
								render={<Link href="/settings" />}
							>
								<Settings className="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-xl border-theme-border-muted text-theme-text-muted"
								nativeButton={false}
								render={<Link href="/contracts" />}
							>
								<History className="w-4 h-4" />
							</Button>
							<LogoutButton />
						</div>
					</div>

					{/* Desktop Actions */}
					<div className="hidden md:flex items-center gap-2">
						{editId && (
							<Button variant="ghost" onClick={() => window.location.href = "/"}>
								Tạo mới
							</Button>
						)}
						<Button
							variant="outline"
							className="gap-2 rounded-xl border-theme-border-muted text-theme-text-muted"
							nativeButton={false}
							render={<Link href="/settings" />}
						>
							<Settings className="w-4 h-4" />
							<span className="text-sm">Cài đặt</span>
						</Button>
						<Button
							variant="outline"
							className="gap-2 rounded-xl border-theme-border-muted text-theme-text-muted"
							nativeButton={false}
							render={<Link href="/contracts" />}
						>
							<History className="w-4 h-4" />
							<span className="text-sm">Lịch sử</span>
						</Button>
						<LogoutButton />
					</div>

					{/* Tabs */}
					<div className="flex gap-1.5 w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2">
						<button
							onClick={() => updateTab("photo")}
							className={cn(
								"flex-1 md:flex-none flex items-center justify-center gap-2 p-2 px-4 rounded-xl text-sm font-bold transition-all",
								activeTab === "photo"
									? "bg-theme-gold-primary text-white shadow-lg shadow-theme-gold-primary/20"
									: "bg-theme-bg-card border border-theme-border-muted text-theme-text-muted hover:bg-theme-bg-muted"
							)}
						>
							<Camera className="w-4 h-4" />
							Phóng sự
						</button>
						<button
							onClick={() => updateTab("wedding")}
							className={cn(
								"flex-1 md:flex-none flex items-center justify-center gap-2 p-2 px-4 rounded-xl text-sm font-bold transition-all",
								activeTab === "wedding"
									? "bg-theme-gold-primary text-white shadow-lg shadow-theme-gold-primary/20"
									: "bg-theme-bg-card border border-theme-border-muted text-theme-text-muted hover:bg-theme-bg-muted"
							)}
						>
							<Heart className="w-4 h-4" />
							Đám cưới
						</button>
					</div>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{/* Left: Form */}
					<div className="no-print">
						{activeTab === "photo" ? (
							<BillForm onDataChange={setBillData} initialData={initialData} contractId={editId || undefined} />
						) : (
							<WeddingContractForm onDataChange={setWeddingData} initialData={weddingInitialData} contractId={editId || undefined} />
						)}
					</div>

					{/* Right: Preview (Desktop Only) */}
					<div className="hidden lg:block relative">
						<div className="lg:sticky lg:top-10">
							<div className="no-print text-sm font-medium text-muted-foreground mb-4 text-center italic">
								Xem trước hợp đồng
							</div>
							{activeTab === "photo" ? (
								<BillPreview data={billData} settings={settings} />
							) : (
								<WeddingContractPreview data={weddingData} settings={settings} />
							)}
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
