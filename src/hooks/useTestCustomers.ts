import useSWR from "swr";
import type { Customer } from "../types";
import { fetcher } from "../lib/fetcher";

/**
 * Fetch a single customer by ID.
 * Still fetches the full list, then filters client-side.
 * You can optimize this later with a backend route like /api/customers/:id
 */
export function useTestCustomer(id?: string) {
	const { data, error, isValidating } = useSWR<Customer>(
		() => (id ? ["/api/customers", id] : null),
		// Fetch full list from FastAPI and filter
		async ([url, id]) => {
			const all = (await fetcher(url)) as Customer[];
			const found = all.find((c) => c.id === id);
			if (!found) throw new Error(`Customer ${id} not found`);
			return found;
		}
	);

	return {
		customer: data,
		isLoading: isValidating,
		isError: Boolean(error),
	};
}
