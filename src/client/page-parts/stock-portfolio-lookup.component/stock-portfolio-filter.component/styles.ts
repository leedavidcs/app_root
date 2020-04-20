import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	filterContainer: {
		height: 80,
		padding: 12,
		backgroundColor: theme.surface,
		borderBottom: {
			width: 1,
			style: "solid",
			color: theme.divider
		}
	},
	advancedFilterContainer: {
		padding: 12,
		backgroundColor: theme.surface
	},
	searchInput: {
		flexGrow: 1,
		margin: 0
	},
	expandBtn: {
		marginTop: 10
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
