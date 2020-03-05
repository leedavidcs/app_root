import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative",
		margin: 0,
		padding: 0,
		backgroundColor: theme.surface,
		color: theme.onSurface,
		fontFamily: theme.fontPrimary,
		listStyleType: "none"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
