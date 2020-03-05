import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		fontFamily: theme.fontPrimary,
		color: theme.onSurface,

		"& > div": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			height: 30,
			width: 30,
			borderRadius: 15,
			overflow: "hidden",
			cursor: "pointer",
			userSelect: "none",
			margin: "0px 4px"
		}
	},
	selected: {
		color: "red"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
