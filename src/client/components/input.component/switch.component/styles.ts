import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& > input:not(:checked)~span.bp3-control-indicator": {
			backgroundColor: [theme.code, "!important"]
		},
		"& > input~span.bp3-control-indicator::before": {
			backgroundColor: [colors.gray2, "!important"]
		}
	},
	info: {
		composes: "bp3-text-muted",
		marginLeft: 4
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
