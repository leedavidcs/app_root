import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-form-content": {
			flex: "1 0"
		}
	},
	regionDropdown: {
		width: "100%",
		height: 30,
		backgroundColor: theme.code,
		color: theme.onSurface,

		"& > option": {
			backgroundColor: theme.surface
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
