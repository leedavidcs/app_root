import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	section: {
		padding: 12,

		"&:not(:last-child)": {
			borderBottom: `1px solid ${colors.darkGray4}`
		}
	},
	inputsContainer: {
		width: "100%",
		maxWidth: 500,
		marginBottom: 32
	},
	costInfo: {
		marginTop: 12,
		fontWeight: 600
	},
	cost: {
		color: colors.blue4
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
