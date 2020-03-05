import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	"@keyframes ripple": {
		to: {
			opacity: 0,
			transform: "scale(2)"
		}
	},
	root: {
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		overflow: "hidden",
		pointerEvents: "none"
	},
	ripple: {
		position: "absolute",
		borderRadius: "100%",
		backgroundColor: theme.onSurface,
		opacity: theme.surfaceOverlayPressed,
		transform: "scale(0)",
		animation: "$ripple 850ms"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
