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
	title: {
		marginLeft: 4
	},
	creditsDisplay: {
		marginLeft: 8
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
