import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		backgroundColor: theme.onSurface,
		position: ({ relative }) => (relative ? "absolute" : "fixed"),
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		height: "100%",
		width: "100%",
		pointerEvents: "none"
	},
	active: {
		opacity: ({ active, opacity }) => (active ? opacity : 0),
		pointerEvents: ({ active, clickThrough }) => (!active || clickThrough ? "none" : "auto")
	},
	transition: {
		transition: ({ animate, transition }) =>
			animate ? `opacity ${transition}ms ease` : "all 0s ease 0s"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
