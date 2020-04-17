import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: "100%",
		maxWidth: 800
	},
	inputsContainer: {
		width: "100%",
		maxWidth: 500,

		[breakpoints.up("sm")]: {
			"& .bp3-label": {
				width: 130,
				textAlign: "right"
			}
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
