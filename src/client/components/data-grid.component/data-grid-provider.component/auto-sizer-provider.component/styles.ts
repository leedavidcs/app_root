import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		boxSizing: "border-box",
		height: "100%",
		width: "100%",
		outline: {
			style: "solid",
			width: 1,
			color: colors.gray4
		},
		fontFamily: theme.fontPrimary,
		fontSize: 14
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
