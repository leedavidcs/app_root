import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	"@global": {
		"html, body": {
			height: "100%",
			margin: 0,
			padding: 0,
			backgroundColor: theme.background
		}
	},
	root: {
		height: "100%",

		[breakpoints.up("sm")]: {
			padding: "96px 25px"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
