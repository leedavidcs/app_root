import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative",
		textAlign: "left",
		textDecoration: "none",
		backgroundColor: theme.surface,
		color: theme.onSurface
	},
	padded: {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		boxSizing: "border-box",
		height: "100%",
		width: "100%",
		padding: "8px 16px",
		cursor: ({ href, selected }) =>
			typeof selected === "boolean" || href ? "pointer" : "unset"
	},
	link: {
		display: "flex",
		height: "100%",
		width: "100%",
		color: "unset",
		textDecoration: "none"
	},
	divider: {
		width: "100%",
		position: "absolute",
		bottom: 0,
		left: 0,
		marginBlockStart: 0,
		marginBlockEnd: 0,
		marginTop: 0,
		marginBottom: 0
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
