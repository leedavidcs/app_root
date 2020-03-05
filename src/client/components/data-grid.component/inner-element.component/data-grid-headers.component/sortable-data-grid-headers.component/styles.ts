import { CustomTheme, getZIndex } from "@/client/themes";
import { transparentize } from "polished";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		borderBottom: {
			color: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
			style: "solid",
			width: 1
		},
		backgroundColor: theme.surface
	},
	frozenPanel: {
		display: "flex",
		transform: ({ xOffset }) => `translateX(${xOffset}px)`,
		zIndex: getZIndex("data-grid-frozen-header")
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
