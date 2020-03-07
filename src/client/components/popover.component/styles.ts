import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& > .bp3-popover-target": {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			height: "100%",
			width: "100%"
		}
	},
	popover: {
		"& > .bp3-popover-content": {
			background: "none"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
