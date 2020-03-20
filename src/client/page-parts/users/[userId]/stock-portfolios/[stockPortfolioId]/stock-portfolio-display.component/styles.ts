import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: "100%",
		maxWidth: 1280,
		color: theme.onBackground
	},
	portfolioName: {
		textAlign: "center"
	},
	portfolioContainer: {
		height: 500
	},
	lastUpdated: {
		marginTop: 20,
		paddingLeft: 20
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
