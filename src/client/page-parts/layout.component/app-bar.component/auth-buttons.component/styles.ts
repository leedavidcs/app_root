import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		marginLeft: 8,

		[breakpoints.up("md")]: {
			marginLeft: 20
		}
	},
	btn: {
		"&:last-child": {
			marginLeft: 8
		},

		[breakpoints.up("md")]: {
			minWidth: 120,

			"&:last-child": {
				marginLeft: 12
			}
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
