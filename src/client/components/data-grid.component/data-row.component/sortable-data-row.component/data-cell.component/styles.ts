import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		boxSizing: "border-box",
		height: "100%",
		backgroundColor: theme.gridOdd,
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
	evenRow: {
		backgroundColor: theme.gridEven
	},
	firstColumn: {
		paddingLeft: 0
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
