import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		height: 30,
		width: 30,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "50%",
		overflow: "hidden",

		"& > .bp3-popover-target": {
			height: "100%",
			width: "100%"
		}
	},
	popover: {
		borderRadius: 4,
		overflow: "hidden"
	},
	interactive: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		width: "100%"
	},
	paper: {
		width: 120,
		padding: 8
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
