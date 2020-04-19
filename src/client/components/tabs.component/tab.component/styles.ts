import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		boxSizing: "border-box",
		padding: "8px 12px",
		borderRadius: "3px 3px 0 0",
		color: theme.onSurface,

		"&.bp3-button:focus": {
			outline: "unset"
		}
	},
	selected: {
		border: `1px solid ${colors.gray3}`
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
