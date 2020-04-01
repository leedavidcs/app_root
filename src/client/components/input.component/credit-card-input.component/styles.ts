import { CustomTheme } from "@/client/themes";
import { Colors } from "@blueprintjs/core";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-form-content": {
			flex: "1 0"
		}
	},
	cardElement: {
		width: "100%",
		padding: "7px",
		borderRadius: 3,
		overflow: "hidden",
		backgroundColor: theme.code,
		color: theme.onSurface
	},
	cardElementFocused: {
		boxShadow: `0 0 0 1px ${Colors.BLUE3}`
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
