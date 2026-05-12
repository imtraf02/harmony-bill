"use server";

import { revalidatePath } from "next/cache";
import type { BillSchema } from "@/lib/schema";
import { createClient } from "@/lib/supabase/server";

export async function saveContract(data: BillSchema) {
	const supabase = await createClient();

	// 1. Insert contract
	const { data: contract, error: contractError } = await supabase
		.from("contracts")
		.insert({
			customer_name: data.customerName,
			phone: data.phone,
			address: data.address,
			wedding_date_start: data.weddingDateStart.toISOString(),
			wedding_date_end: data.weddingDateEnd.toISOString(),
			travel_fee: data.travelFee,
			discount: data.discount,
			incurred_cost: data.incurredCost,
			incurred_cost_reason: data.incurredCostReason,
			include_vat: data.includeVAT,
			benefits: data.benefits,
			deposit: data.deposit,
			pickup_date: data.pickupDate.toISOString(),
			contract_date: data.contractDate.toISOString(),
		})
		.select()
		.single();

	if (contractError) {
		console.error("Error saving contract:", contractError);
		return { error: contractError.message };
	}

	// 2. Insert contract packages
	const contractPackages = data.packages.map((pkg) => ({
		contract_id: contract.id,
		package_id: pkg.id || null,
		label: pkg.label,
		price: pkg.price,
	}));

	const { error: packagesError } = await supabase
		.from("contract_packages")
		.insert(contractPackages);

	if (packagesError) {
		console.error("Error saving contract packages:", packagesError);
		// Should ideally rollback contract insertion, but for simplicity:
		return { error: packagesError.message };
	}

	revalidatePath("/");
	return { success: true, id: contract.id };
}

export async function getContractById(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("contracts")
		.select(`
      *,
      contract_packages (*)
    `)
		.match({ id })
		.single();

	if (error) {
		console.error("Error fetching contract:", error);
		return null;
	}

	return data;
}

export async function getContracts() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("contracts")
		.select(`
      *,
      contract_packages (*)
    `)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching contracts:", error);
		return [];
	}

	return data;
}

export async function deleteContract(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("contracts").delete().match({ id });

	if (error) return { error: error.message };
	revalidatePath("/contracts");
	return { success: true };
}

export async function getMasterPackages() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("master_packages")
		.select("*")
		.order("label");

	if (error) {
		console.error("Error fetching master packages:", error);
		return [];
	}

	return data;
}

export async function addMasterPackage(label: string, price: number) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("master_packages")
		.insert({ label, price })
		.select()
		.single();

	if (error) return { error: error.message };
	revalidatePath("/");
	return { success: true, data };
}

export async function updateMasterPackage(
	id: string,
	label: string,
	price: number,
) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("master_packages")
		.update({ label, price })
		.match({ id })
		.select()
		.single();

	if (error) return { error: error.message };
	revalidatePath("/");
	return { success: true, data };
}

export async function deleteMasterPackage(id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("master_packages")
		.delete()
		.match({ id });

	if (error) return { error: error.message };
	revalidatePath("/");
	return { success: true };
}

export async function getSettings() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("settings")
		.select("*")
		.match({ id: "main" })
		.single();

	if (error) {
		console.error("Error fetching settings:", error);
		return null;
	}

	return {
		studioName: data.studio_name,
		address: data.address,
		email: data.email,
		phone: data.phone,
		bankAccounts: data.bank_accounts,
		backgroundUrl: data.background_url,
		signatureUrl: data.signature_url,
	};
}

export async function updateSettings(data: any) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("settings")
		.update({
			studio_name: data.studioName,
			address: data.address,
			email: data.email,
			phone: data.phone,
			bank_accounts: data.bankAccounts,
			background_url: data.backgroundUrl,
			signature_url: data.signatureUrl,
			updated_at: new Date().toISOString(),
		})
		.match({ id: "main" });

	if (error) {
		console.error("Error updating settings:", error);
		return { error: error.message };
	}

	revalidatePath("/");
	return { success: true };
}

import type { WeddingContractSchema } from "@/lib/schema";

export async function getWeddingCombos() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("wedding_combos")
		.select(`
			*,
			wedding_combo_services (*)
		`)
		.order("name");

	if (error) {
		console.error("Error fetching wedding combos:", error);
		return [];
	}

	return data;
}

export async function saveWeddingContract(data: WeddingContractSchema) {
	const supabase = await createClient();

	// 1. Insert contract
	const { data: contract, error: contractError } = await supabase
		.from("wedding_contracts")
		.insert({
			customer_name: data.customerName,
			phone: data.phone,
			address: data.address,
			wedding_date: data.weddingDate.toISOString(),
			travel_fee: data.travelFee,
			discount: data.discount,
			incurred_cost: data.incurredCost,
			incurred_cost_reason: data.incurredCostReason,
			include_vat: data.includeVAT,
			deposit: data.deposit,
			pickup_date: data.pickupDate.toISOString(),
			contract_date: data.contractDate.toISOString(),
			notes: data.notes,
		})
		.select()
		.single();

	if (contractError) {
		console.error("Error saving wedding contract:", contractError);
		return { error: contractError.message };
	}

	// 2. Insert combos and services
	for (const combo of data.combos) {
		const { data: insertedCombo, error: comboError } = await supabase
			.from("wedding_contract_combos")
			.insert({
				contract_id: contract.id,
				combo_id: combo.id || null,
				combo_name: combo.comboName,
				base_price: combo.basePrice,
			})
			.select()
			.single();

		if (comboError) {
			console.error("Error saving wedding contract combo:", comboError);
			continue;
		}

		const services = combo.services.map((s, idx) => ({
			contract_combo_id: insertedCombo.id,
			service_name: s.name,
			is_removed: s.isRemoved,
			note: s.note,
			sort_order: idx,
		}));

		const { error: servicesError } = await supabase
			.from("wedding_contract_combo_services")
			.insert(services);

		if (servicesError) {
			console.error("Error saving wedding contract combo services:", servicesError);
		}
	}

	revalidatePath("/");
	revalidatePath("/contracts");
	return { success: true, id: contract.id };
}

export async function getWeddingContracts() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("wedding_contracts")
		.select(`
			*,
			wedding_contract_combos (
				*,
				wedding_contract_combo_services (*)
			)
		`)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching wedding contracts:", error);
		return [];
	}

	return data;
}

export async function getWeddingContractById(id: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("wedding_contracts")
		.select(`
			*,
			wedding_contract_combos (
				*,
				wedding_contract_combo_services (*)
			)
		`)
		.match({ id })
		.single();

	if (error) {
		console.error("Error fetching wedding contract:", error);
		return null;
	}

	return data;
}

export async function deleteWeddingContract(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("wedding_contracts").delete().match({ id });

	if (error) return { error: error.message };
	revalidatePath("/contracts");
	return { success: true };
}

export async function addWeddingCombo(data: { name: string, description?: string, basePrice: number, services: { name: string }[] }) {
	const supabase = await createClient();
	const { data: combo, error: comboError } = await supabase
		.from("wedding_combos")
		.insert({
			name: data.name,
			description: data.description,
			base_price: data.basePrice,
		})
		.select()
		.single();

	if (comboError) return { error: comboError.message };

	const services = data.services.map((s, idx) => ({
		combo_id: combo.id,
		name: s.name,
		sort_order: idx,
	}));

	const { error: servicesError } = await supabase
		.from("wedding_combo_services")
		.insert(services);

	if (servicesError) return { error: servicesError.message };

	revalidatePath("/wedding-combos");
	return { success: true };
}

export async function updateWeddingCombo(id: string, data: { name: string, description?: string, basePrice: number, services: { name: string }[] }) {
	const supabase = await createClient();

	// Update combo info
	const { error: comboError } = await supabase
		.from("wedding_combos")
		.update({
			name: data.name,
			description: data.description,
			base_price: data.basePrice,
			updated_at: new Date().toISOString(),
		})
		.match({ id });

	if (comboError) return { error: comboError.message };

	// Simple way: delete old services and insert new ones
	await supabase.from("wedding_combo_services").delete().match({ combo_id: id });

	const services = data.services.map((s, idx) => ({
		combo_id: id,
		name: s.name,
		sort_order: idx,
	}));

	const { error: servicesError } = await supabase
		.from("wedding_combo_services")
		.insert(services);

	if (servicesError) return { error: servicesError.message };

	revalidatePath("/wedding-combos");
	return { success: true };
}

export async function deleteWeddingCombo(id: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("wedding_combos").delete().match({ id });

	if (error) return { error: error.message };
	revalidatePath("/wedding-combos");
	return { success: true };
}

