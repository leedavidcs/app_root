import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const OVERLAY_WIDTH = 680;

const styles = (theme: CustomTheme) => ({
	root: {
		backgroundColor: theme.backdrop
	},
	content: {
		position: "relative",
		top: 0,
		left: `calc(50vw - ${OVERLAY_WIDTH / 2}px)`,
		width: OVERLAY_WIDTH,
		margin: "10vh 0",
		backgroundColor: theme.surface,
		color: theme.onSurface,
		"&-appear-active&$content": {
			transform: "translateY(-80vh) rotate(-10deg)"
		},
		"&-appear-done&$content": {
			transform: "translateY(0) rotate(0deg)",
			transitionTimingFunction: "cubic-bezier(0.54, 1.12, 0.38, 1.11)",
			transitionDuration: "300ms"
		},
		"&-enter-active&$content": {
			transform: "translateY(-80vh) rotate(-10deg)"
		},
		"&-enter-done&$content": {
			transform: "translateY(0) rotate(0deg)",
			transitionTimingFunction: "cubic-bezier(0.54, 1.12, 0.38, 1.11)",
			transitionDuration: "300ms"
		},
		"&-exit-active&$content": {
			transform: "translateY(150vh) rotate(-20deg)",
			transitionTimingFunction: "cubic-bezier(0.54, 1.12, 0.38, 1.11)",
			transitionDuration: "500ms"
		}
	},
	title: {
		position: "relative"
	},
	closeBtn: {
		position: "absolute",
		right: 0,
		cursor: "pointer",
		border: `1px solid ${theme.onSurface}`
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
