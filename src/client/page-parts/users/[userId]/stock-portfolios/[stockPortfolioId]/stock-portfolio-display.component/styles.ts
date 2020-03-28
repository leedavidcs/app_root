import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: "100%",
		color: theme.onBackground
	},
	btnContainer: {
		display: "flex",
		justifyContent: "flex-end"
	},
	publicActions: {
		flexGrow: 1
	},
	portfolioName: {
		textAlign: "center"
	},
	portfolioContainer: {
		width: "100%",
		height: 500
	},
	portfolioFooter: {
		marginTop: 20,
		display: "flex"
	},
	createdBy: {
		flexGrow: 1,
		paddingLeft: 20
	},
	lastUpdated: {
		paddingRight: 20
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
