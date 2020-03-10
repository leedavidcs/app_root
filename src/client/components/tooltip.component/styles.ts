import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	popover: {
		"& > .bp3-popover-content": {
			backgroundColor: ({ popoverColor }) => popoverColor,
			color: theme.onSurface
		},

		"& .bp3-popover-arrow-fill": {
			fill: ({ popoverColor }) => popoverColor
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
