import { CustomTheme } from "@/client/themes";
import { transparentize } from "polished";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		position: "relative",
		height: 28,
		outline: {
			width: 1,
			style: "solid",
			color: transparentize(1 - theme.mediumEmphasis, theme.onSurface)
		},
		backgroundColor: theme.surface,
		color: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
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
		lineHeight: "28px"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
