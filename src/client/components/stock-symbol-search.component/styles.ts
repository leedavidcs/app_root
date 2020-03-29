import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-menu": {
			maxHeight: 160,
			overflowY: "scroll"
		},

		'& span[icon="caret-right"].bp3-icon-caret-right': {
			display: "none"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
