import useSWR from 'swr';
import type { Therapist } from '../types';
import { fetcher } from '../lib/fetcher';

/** Fetch therapists from local test data (public/therapists.json) */
export function useTestTherapists() {
  const { data, error, isLoading } = useSWR<Therapist[]>('/therapists.json', fetcher);
  return {
    therapists: data || [],
    isLoading,
    isError: Boolean(error),
  };
} 