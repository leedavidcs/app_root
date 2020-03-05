import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "absolute",
		top: 28,
		left: 0,
		zIndex: getZIndex("data-grid-content")
	},
	helper: {
		width: ({ width }) => [width, "!important"],
		overflow: "hidden"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
