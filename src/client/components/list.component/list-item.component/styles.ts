import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative",
		backgroundColor: theme.surface,
		color: theme.onSurface,

		"& a, a:hover": {
			textDecoration: "none",
			color: theme.onSurface
		}
	},
	link: {
		display: "flex",
		alignItems: "center",
		padding: "10px 14px",

		"& > .bp3-icon": {
			marginTop: 3,
			marginRight: 8
		}
	},
	textWrapper: {
		flexGrow: 1
	},
	info: {
		marginTop: 4,
		fontSize: 12
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
