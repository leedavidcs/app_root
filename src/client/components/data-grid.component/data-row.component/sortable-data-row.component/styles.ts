import { CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		backgroundColor: theme.gridOdd,

		"&:not($evenRow) *": {
			backgroundColor: theme.gridOdd
		},

		"&$evenRow *": {
			backgroundColor: theme.gridEven
		}
	},
	frozenPanel: {
		boxSizing: "border-box",
		display: "flex",
		transform: ({ xOffset }) => `translateX(${xOffset}px)`,
		zIndex: getZIndex("data-grid-frozen-cell"),
		backgroundColor: theme.gridOdd,
		borderRight: `1px solid ${theme.primary}`
	},
	evenRow: {
		backgroundColor: theme.gridEven
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
