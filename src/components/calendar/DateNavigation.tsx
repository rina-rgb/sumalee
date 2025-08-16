import { Button } from "../../tw-components/button";
import { formatDate, toIsoDate } from "../../utils/date";

export function DateNavigation({
	currentDate,
	onPrev,
	onToday,
	onNext,
}: {
	currentDate: Date;
	onPrev: () => void;
	onToday: () => void;
	onNext: () => void;
}) {
	return (
		<>
			<div className="flex justify-between gap-4 mx-6 my-4 text-lg">
				<time dateTime={toIsoDate(currentDate)} className="font-medium">
					{formatDate(currentDate)}
				</time>
				<nav role="toolbar" aria-label="Date navigation" className="flex gap-2">
					<button
						type="button"
						onClick={onPrev}
						className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
						aria-label="Previous day"
					>
						←
					</button>
					<Button
						type="button"
						onClick={onToday}
						className="cursor-pointer"
						aria-label="Today"
					>
						Today
					</Button>
					<button
						type="button"
						onClick={onNext}
						className="hover:bg-gray-200 px-2 py-1 rounded cursor-pointer"
						aria-label="Next day"
					>
						→
					</button>
				</nav>
			</div>
		</>
	);
}
