// hooks/useTestCustomer.ts
import useSWR from "swr";
import type { Customer } from "../types";
import { fetcher } from "../lib/fetcher";

export function useTestCustomer(id?: string) {
  const { data, error, isValidating } = useSWR<Customer>(
    () => (id ? ["/customers.json", id] : null),
    // fetch /customers.json once, then return only the matching record
    async ([url, id]) => {
      const all = await fetcher(url) as Customer[];
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
