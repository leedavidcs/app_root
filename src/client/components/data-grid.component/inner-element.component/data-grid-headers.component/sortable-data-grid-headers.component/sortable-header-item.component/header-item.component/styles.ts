import { DATA_GRID_ROW_HEIGHT } from "@/client/components/data-grid.component";
import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		position: "relative",
		height: DATA_GRID_ROW_HEIGHT,
		outline: `1px solid ${colors.gray1}`,
		backgroundColor: theme.surface,
		color: colors.gray5,
		cursor: "pointer",
		userSelect: "none"
	},
	content: {
		boxSizing: "border-box",
		paddingLeft: 4,
		width: "100%",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		lineHeight: `${DATA_GRID_ROW_HEIGHT}px`
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
