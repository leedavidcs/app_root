import { CustomTheme } from "@/client/themes";
import { transparentize } from "polished";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		boxSizing: "border-box",
		height: "100%",
		width: "100%",
		outline: {
			style: "solid",
			width: 1,
			color: transparentize(1 - theme.mediumEmphasis, theme.onSurface)
		},
		fontFamily: theme.fontPrimary,
		fontSize: 14
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
