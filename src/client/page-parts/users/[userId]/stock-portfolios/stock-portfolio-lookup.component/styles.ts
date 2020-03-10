import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		maxWidth: 640
	},
	resultsContainer: {
		marginTop: 20
	},
	createNewContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: 65,
		backgroundColor: theme.surface,
		borderBottom: `1px solid ${theme.divider}`
	},
	results: {
		maxHeight: 600,
		overflowY: "scroll"
	},
	pagination: {
		marginTop: 20
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
