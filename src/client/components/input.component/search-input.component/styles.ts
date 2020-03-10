import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	input: {
		flexGrow: 1,
		backgroundColor: theme.code,

		"& input.bp3-input": {
			backgroundColor: theme.code,
			color: theme.onSurface
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
