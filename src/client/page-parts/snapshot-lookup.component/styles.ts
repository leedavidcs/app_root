import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: 200,
		"&.bp3-popover-wrapper": {
			display: "flex"
		},

		"& > .bp3-popover-target": {
			flexGrow: 1
		},

		"& .bp3-popover-content": {
			boxSizing: "borderBox",
			width: 200
		}
	},
	dateInputs: {
		"&.bp3-form-group": {
			marginBottom: 4
		}
	},
	list: {
		width: "100%",
		minHeight: 30,
		maxHeight: 200
	},
	btn: {
		width: "100%"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
