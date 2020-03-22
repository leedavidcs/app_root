import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: "100%",
		color: theme.onBackground
	},
	createdBy: {
		flexGrow: 1,
		paddingLeft: 20
	},
	lastUpdated: {
		paddingRight: 20
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
