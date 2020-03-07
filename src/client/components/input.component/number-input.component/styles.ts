import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	input: {
		backgroundColor: theme.code,
		borderRadius: 4,
		color: theme.onSurface,

		"& input.bp3-input": {
			backgroundColor: theme.code,
			borderRadius: 4,
			color: theme.onSurface
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
