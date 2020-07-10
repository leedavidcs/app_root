import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	section: {
		padding: 12,

		"&:not(:last-child)": {
			borderBottom: `1px solid ${colors.darkGray4}`
		}
	},
	info: {
		color: theme.textMuted
	},
	code: {
		padding: "0 2px",
		margin: "0 2px",
		borderRadius: 3,
		backgroundColor: theme.code,
		color: theme.onSurface
	},
	inputsContainer: {
		width: "100%",
		maxWidth: 500
	},
	title: {
		fontSize: 14
	},
	graphqlExplorer: {
		height: 420,
		width: "100%",
		marginBottom: 24
	},
	deleteBtn: {
		marginLeft: 8
	},
	queryTitle: {
		margin: 0,
		marginBottom: 12,
		fontSize: 14,
		fontWeight: 400
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
