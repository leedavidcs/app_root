import { breakpoints, colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: "100%",
		border: `1px solid ${colors.darkGray4}`,
		borderRadius: 3,
		overflow: "hidden",
		backgroundColor: theme.surface,

		"& .bp3-menu": {
			backgroundColor: theme.surface,
			color: theme.link
		},

		[breakpoints.up("sm")]: {
			width: 220
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
