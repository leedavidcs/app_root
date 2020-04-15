import { colors, CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	headers: {
		display: "flex",
		borderBottom: {
			color: colors.gray4,
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
