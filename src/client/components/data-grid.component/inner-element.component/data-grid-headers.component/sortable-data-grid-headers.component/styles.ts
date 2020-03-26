import { colors, CustomTheme, getZIndex } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		borderBottom: `1px solid ${colors.gray1}`,
		backgroundColor: theme.surface
	},
	frozenPanel: {
		display: "flex",
		transform: ({ xOffset }) => `translateX(${xOffset}px)`,
		zIndex: getZIndex("data-grid-frozen-header")
	},
	labelInput: {
		padding: "0px 4px",
		border: `1px solid ${theme.primary}`,
		backgroundColor: theme.code,
		color: theme.onSurface
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
