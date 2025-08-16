import useSWR from "swr";
import type { Therapist } from "../types";
import { fetcher } from "../lib/fetcher";

/** Fetch therapists from FastAPI endpoint instead of public JSON */
export function useTestTherapists() {
	const { data, error, isLoading } = useSWR<Therapist[]>(
		"/api/therapists",
		fetcher
	);

	return {
		therapists: data || [],
		isLoading,
		isError: Boolean(error),
	};
}
