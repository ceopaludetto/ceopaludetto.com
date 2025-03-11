// This adds support for tw prop in the component
import {} from "@vercel/og";
import { formatDate } from "date-fns";

export type ImageProps = {
	title: string;
	theme: Record<string, string>;
	date: Date;
};

export function image({ title, theme, date }: ImageProps) {
	const headlineMedium = {
		fontSize: "74px",
		lineHeight: "96px",
		letterSpacing: "0",
		fontFamily: "Lora",
		fontWeight: 400,
	};

	const bodyLarge = {
		fontSize: "48px",
		lineHeight: "72px",
		letterSpacing: "0.5",
		fontFamily: "Poppins",
		fontWeight: 400,
	};

	return (
		<div
			tw="flex flex-col px-14 py-10 h-full w-full"
			style={{ backgroundColor: variableToRGB(theme["--background"]) }}
		>
			<div tw="flex flex-col flex-grow">
				<h1 tw="mb-1 text-balance" style={{ ...headlineMedium, color: variableToRGB(theme["--on-background"]) }}>
					{title}
				</h1>
				<p tw="mt-0 mb-8" style={{ ...bodyLarge, color: variableToRGB(theme["--on-surface-variant"]) }}>
					{formatDate(date, "MMMM d, yyyy")}
				</p>
			</div>
			<div tw="flex justify-end">
				<p style={{ ...headlineMedium, color: variableToRGB(theme["--on-background"]) }}>
					ceo
					<span style={{ color: variableToRGB(theme["--primary"]) }}>.</span>
				</p>
			</div>
		</div>
	);
}

function variableToRGB(value: string, alpha: number = 1) {
	return `rgb(${value} / ${alpha})`;
}
