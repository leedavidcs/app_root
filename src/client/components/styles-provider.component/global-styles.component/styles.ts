import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	"@global": {
		"html, body": {
			height: "100%",
			margin: 0,
			padding: 0,
			backgroundColor: theme.background,
			fontFamily: theme.fontPrimary
		}
	},
	root: {
		marginTop: 72
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
