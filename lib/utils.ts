import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BillSchema } from "./schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapToBillSchema(contract: any): Partial<BillSchema> {
	if (!contract) return {};
	return {
		customerName: contract.customer_name,
		phone: contract.phone,
		address: contract.address,
		packages: contract.contract_packages?.map((p: any) => ({
			id: p.package_id,
			label: p.label,
			price: Number(p.price),
		})) || [],
		weddingDateStart: new Date(contract.wedding_date_start),
		weddingDateEnd: new Date(contract.wedding_date_end),
		travelFee: Number(contract.travel_fee),
		discount: Number(contract.discount),
		includeVAT: contract.include_vat,
		benefits: contract.benefits,
		deposit: Number(contract.deposit),
		pickupDate: new Date(contract.pickup_date),
		contractDate: new Date(contract.contract_date),
	};
}
