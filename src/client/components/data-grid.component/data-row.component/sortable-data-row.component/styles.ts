import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex"
	},
	frozenPanel: {
		display: "flex",
		transform: ({ xOffset }) => `translateX(${xOffset}px)`,
		zIndex: getZIndex("data-grid-frozen-cell")
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
