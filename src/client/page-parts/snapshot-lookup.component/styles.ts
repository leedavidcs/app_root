import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"&.bp3-popover-wrapper": {
			flex: "unset"
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
		padding: "0 8px"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
