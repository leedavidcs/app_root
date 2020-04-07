import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"&.bp3-navbar": {
			backgroundColor: theme.surface,
			color: theme.onSurface,
			height: 56,
			zIndex: getZIndex("app-bar")
		}
	},
	group: {
		width: "100%",
		height: 56
	},
	icon: {
		marginRight: 12
	},
	title: {
		fontFamily: theme.fontPrimary,
		fontSize: "1.2rem",
		cursor: "pointer"
	},
	searchWrapper: {
		flexGrow: 1
	},
	search: {
		flexGrow: 1,
		margin: 0
	},
	profileIcon: {
		marginLeft: 12,
		cursor: "pointer"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
