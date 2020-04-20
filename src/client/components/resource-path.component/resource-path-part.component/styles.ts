import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		fontSize: 18
	},
	active: {
		fontWeight: "bold"
	},
	divider: {
		margin: "0 4px"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
