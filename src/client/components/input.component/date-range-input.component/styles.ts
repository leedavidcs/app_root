import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	input: {
		backgroundColor: theme.code,

		"& > .bp3-popover-target": {
			display: "flex",

			"& > .bp3-control-group": {
				flexGrow: 1
			}
		},

		"& input.bp3-input": {
			backgroundColor: theme.code,
			color: theme.onSurface
		}
	},
	popover: {
		"&.bp3-popover > .bp3-popover-arrow": {
			"& *": {
				fill: theme.code
			}
		},
		"&.bp3-popover > .bp3-popover-content": {
			"& *": {
				backgroundColor: theme.code
			}
		}
	},
	verticalInputs: {
		"& .bp3-control-group": {
			flexDirection: "column"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
