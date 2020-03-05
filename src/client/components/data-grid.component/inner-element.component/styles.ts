import { CustomTheme, getZIndex } from "@/client/themes";
import { transparentize } from "polished";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	headers: {
		display: "flex",
		borderBottom: {
			color: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
			style: "solid",
			width: 1
		},
		position: "sticky",
		top: 0,
		left: 0,
		backgroundColor: theme.surface,
		zIndex: getZIndex("data-grid-header")
	},
	dragHeadersHelper: {
		pointerEvents: ["auto", "!important"] as any,
		cursor: ["ew-resize", "!important"] as any
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
