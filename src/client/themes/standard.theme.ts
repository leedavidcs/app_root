import { lighten } from "polished";

const GRID_ODD = 0.16;
const GRID_EVEN = 0.1;

export const standardTheme = {
	background: "#121212",
	surface: "#1D1D1D",
	code: "#3E3E3E",
	primary: "#BB86FC",
	primaryVariant: "#3700B3",
	secondary: "#03DAC6",
	secondaryVariant: "#03DAC6",
	onBackground: "#FFFFFF",
	onSurface: "#FFFFFF",
	error: "#CF6679",
	warning: "#FF5C01",
	transparent: "rgba(0, 0, 0, 0)",
	onPrimary: "#000000",
	onSecondary: "#000000",
	onError: "#000000",
	onWarning: "#000000",
	success: "#A6E22E",
	link: "#90CAF9",
	highEmphasis: 0.87,
	mediumEmphasis: 0.6,
	disabled: 0.38,
	backdrop: "rgba(255, 255, 255, 0.08)",
	surfaceOverlay: "#FFFFFF",
	surfaceOverlayVariant: "#BB86FC",
	surfaceOverlayHovered: 0.04,
	surfaceOverlayFocused: 0.12,
	surfaceOverlayPressed: 0.1,
	surfaceOverlayDragged: 0.08,
	fontPrimary: [
		"Helvetica Neue",
		"Helvetica",
		"Arial",
		"Roboto",
		"Segoe UI",
		"sans-serif"
	].join(),
	gridOdd: lighten(GRID_ODD, "#000"),
	gridEven: lighten(GRID_EVEN, "#000"),
	gridSelected: "#00B0FF",
	surfaceLoading: "#323232",
	surfaceLoadingHighlight: "#A6A6A6"
};
