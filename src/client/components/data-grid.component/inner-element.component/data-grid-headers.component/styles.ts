import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "sticky",
		top: 0,
		left: 0,
		zIndex: getZIndex("data-grid-header")
	},
	helper: {
		pointerEvents: ["auto", "!important"] as any,
		cursor: ["ew-resize", "!important"] as any
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
