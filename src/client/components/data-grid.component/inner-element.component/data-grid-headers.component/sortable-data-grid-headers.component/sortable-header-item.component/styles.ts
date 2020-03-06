import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		height: "100%"
	},
	editLabel: {
		boxSizing: "border-box",
		height: "100%",
		width: "100%",
		paddingLeft: 4,
		backgroundColor: theme.surface,
		color: theme.onSurface,

		"&:focus": {
			border: {
				width: 2,
				style: "solid",
				color: theme.secondaryVariant
			},
			outline: "none"
		}
	},
	contextMenu: {
		backgroundColor: theme.surface,
		color: theme.onSurface
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
