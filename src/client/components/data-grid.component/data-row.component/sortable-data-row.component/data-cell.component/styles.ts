import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		boxSizing: "border-box",
		height: "100%",
		paddingLeft: 4,
		color: theme.onSurface,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis"
	},
	selected: {
		border: {
			color: theme.gridSelected,
			style: "solid",
			width: 1
		},
		zIndex: getZIndex("data-grid-selected-cell")
	},
	firstColumn: {
		paddingLeft: 0
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
