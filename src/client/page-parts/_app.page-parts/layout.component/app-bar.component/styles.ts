import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		backgroundColor: theme.surface,
		color: theme.onSurface
	},
	contentWrapper: {
		display: "flex",
		height: "100%",
		paddingLeft: 6,
		paddingRight: 6,
		alignItems: "center"
	},
	menuBtnWrapper: {
		display: "flex",
		flex: "0 0 auto",
		alignItems: "center",
		justifyContent: "center",
		height: 48,
		width: 48,
		marginRight: 12,
		borderRadius: 24,
		cursor: "pointer"
	},
	title: {
		fontFamily: theme.fontPrimary,
		fontSize: "1.25rem",
		fontWeight: 500
	},
	searchWrapper: {
		display: "flex",
		flexGrow: 1,
		width: "auto",
		margin: "0 20px"
	},
	authBtnWrapper: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
		marginRight: 12
	},
	authBtn: {
		marginLeft: 4,

		[breakpoints.up("md")]: {
			minWidth: 120,

			"&:last-child": {
				marginLeft: 12
			}
		}
	},
	profileIcon: {
		display: "flex",
		marginRight: 10,
		cursor: "pointer"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
