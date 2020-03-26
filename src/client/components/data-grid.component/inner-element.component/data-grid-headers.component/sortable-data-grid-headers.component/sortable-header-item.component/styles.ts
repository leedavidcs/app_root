import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-popover-wrapper, .bp3-popover-target": {
			width: "100%"
		}
	},
	contextMenu: {
		borderRadius: "unset",
		backgroundColor: theme.surface,
		color: theme.onSurface,
		overflow: "hidden"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
