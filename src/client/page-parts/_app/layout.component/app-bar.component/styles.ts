import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		backgroundColor: theme.surface,
		color: theme.onSurface,
		height: 56
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
		fontSize: "1.2rem"
	},
	searchWrapper: {
		flexGrow: 1
	},
	search: {
		flexGrow: 1,
		margin: 0
	},
	authBtn: {
		marginLeft: 20,

		[breakpoints.up("md")]: {
			minWidth: 120,

			"&:last-child": {
				marginLeft: 12
			}
		}
	},
	profileIcon: {
		marginLeft: 12,
		cursor: "pointer"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
