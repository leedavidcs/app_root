import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-control-group.bp3-numeric-input": {
			marginBottom: 12,
			backgroundColor: theme.code,

			"& > :first-child": {
				borderRadius: 0
			}
		},

		"& .bp3-slider-track": {
			backgroundColor: theme.code
		}
	},
	inline: {
		"& .bp3-form-content": {
			flex: "1 0"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
