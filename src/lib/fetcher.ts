export const fetcher = (url: string) =>
	fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`).then((r) => r.json());
