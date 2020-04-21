import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	section: {
		padding: 12,

		"&:not(:last-child)": {
			borderBottom: `1px solid ${colors.darkGray4}`
		}
	},
	code: {
		backgroundColor: theme.code,
		padding: "0 2px",
		margin: "0 2px",
		borderRadius: 3
	},
	inputsContainer: {
		width: "100%",
		maxWidth: 500,
		marginBottom: 32
	},
	title: {
		fontSize: 14
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
