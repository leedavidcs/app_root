import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-drawer": {
			backgroundColor: theme.dialogBackground,
			color: theme.onSurface
		},

		"& .bp3-drawer-header": {
			paddingLeft: 4
		}
	},
	backdrop: {
		backgroundColor: theme.backdrop
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
