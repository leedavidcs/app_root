import { DATA_GRID_ROW_HEIGHT } from "@/client/components/data-grid.component";
import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-popover-wrapper, .bp3-popover-target": {
			width: "100%"
		}
	},
	editLabel: {
		boxSizing: "border-box",
		height: DATA_GRID_ROW_HEIGHT,
		width: "100%",
		paddingLeft: 4,
		backgroundColor: theme.surface,
		color: theme.onSurface,

		"&:focus": {
			border: {
				width: 2,
				style: "solid",
				color: theme.secondaryVariant
			},
			outline: "none"
		}
	},
	contextMenu: {
		borderRadius: "unset",
		backgroundColor: theme.surface,
		color: theme.onSurface,
		overflow: "hidden"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
