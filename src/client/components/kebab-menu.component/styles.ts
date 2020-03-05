import { CustomTheme, getZIndex } from "@/client/themes";
import { transparentize } from "polished";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		height: ({ size }) => size,
		width: ({ size }) => size,
		borderRadius: ({ size }) => size / 2,
		color: theme.onSurface,
		overflow: "hidden",
		cursor: "pointer"
	},
	menu: {
		border: {
			style: "solid",
			width: 1,
			color: transparentize(1 - theme.mediumEmphasis, theme.onSurface)
		},
		borderRadius: 3,
		zIndex: getZIndex("kebab-menu"),
		overflow: "hidden"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
