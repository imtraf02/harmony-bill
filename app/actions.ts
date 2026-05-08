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
