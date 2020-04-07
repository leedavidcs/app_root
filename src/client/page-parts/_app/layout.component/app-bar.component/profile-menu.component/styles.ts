import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		marginLeft: 12,
		borderRadius: 12,
		overflow: "hidden",

		"& .bp3-menu": {
			backgroundColor: theme.surface
		}
	},
	icon: {
		cursor: "pointer"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
