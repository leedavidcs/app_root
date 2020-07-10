import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative",
		padding: 0,
		border: `1px solid ${colors.darkGray4}`,

		"&.bp3-card": {
			backgroundColor: theme.surface
		}
	},
	title: {
		padding: "8px 10px",
		borderBottom: `1px solid ${colors.darkGray4}`,
		fontSize: 14
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
