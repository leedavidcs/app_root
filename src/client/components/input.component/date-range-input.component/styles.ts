import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	input: {
		backgroundColor: theme.code,

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
	inlineInputs: {
		"& .bp3-control-group": {
			flexDirection: "column"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
