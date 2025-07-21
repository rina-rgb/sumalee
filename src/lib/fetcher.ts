export const fetcher = async(
  ...args: Parameters<typeof fetch>
) => {
  const res = await fetch(...args);
  if (!res.ok) {
    throw new Error(`Error fetching ${args[0]}: ${res.statusText}`);
  }
  return res.json();
};