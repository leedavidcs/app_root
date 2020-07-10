import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "100%",
		backgroundColor: theme.surface
	},
	iexAttribution: {
		width: "100%",
		maxWidth: 1280,
		padding: "8px 0",
		borderBottom: `1px solid ${theme.disabled}`,
		color: colors.gray2
	},
	main: {
		display: "flex",
		padding: "24px 8px",
		width: "100%",
		maxWidth: 1280
	},
	brand: {
		flexGrow: 1,

		"& a, a:hover": {
			color: theme.onSurface
		}
	},
	divider: {
		borderColor: [[theme.disabled], "!important"]
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
