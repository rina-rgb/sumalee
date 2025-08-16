import { Select } from "../../tw-components/select";
import { Duration, DURATION_OPTIONS } from "../../hooks/useDurationSelector";

interface DurationSelectorProps {
	value: Duration;
	onChange: (duration: Duration) => void;
	label?: string;
}

export default function DurationSelector({ value, onChange, label }: DurationSelectorProps) {
	return (
		<div className="flex items-center gap-3">
			{label && (
				<span className="text-sm font-medium text-gray-700 whitespace-nowrap">
					{label}
				</span>
			)}
			<Select
				value={value}
				onChange={(event) => onChange(Number(event.target.value) as Duration)}
				className="w-32"
			>
				{DURATION_OPTIONS.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Select>
		</div>
	);
}