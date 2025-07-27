"use client";

import * as motion from "motion/react-client";

interface ToggleSwitchProps {
	isOn: boolean;
	onToggle: () => void;
	label?: string;
}

export default function ToggleSwitch({ isOn, onToggle, label }: ToggleSwitchProps) {
	return (
		<div className="flex justify-end items-center gap-3">
			{label && (
				<span className="text-sm font-medium text-gray-700">{label}</span>
			)}
			<button
				className={`flex 
          bg-blue-100
         p-2 rounded-4xl w-16 h-8 cursor-pointer toggle-container"`}
				style={{
					...container,
					justifyContent: "flex-" + (isOn ? "end" : "start"),
				}}
				onClick={onToggle}
				aria-label={label || "Toggle switch"}
				role="switch"
				aria-checked={isOn}
			>
				<motion.div
					className={`rounded-4xl w-4 h-4 toggle-handle ${
						isOn ? "bg-blue-500" : "bg-blue-200"
					}`}
					layout
					transition={{
						type: "spring",
						visualDuration: 0.2,
						bounce: 0.2,
					}}
				/>
			</button>
		</div>
	);
}

/**
 * ==============   Styles   ================
 */

const container = {
	// width: 100,
	// height: 50,
	// borderRadius: 50,
	// cursor: "pointer",
	// display: "flex",
	// padding: 10,
};

// const handle = {
//   width: 20,
//   height: 20,
//   backgroundColor: "gry"
//   borderRadius: "50%",
// };
