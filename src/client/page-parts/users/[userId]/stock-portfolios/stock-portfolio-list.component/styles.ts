import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		height: ({ size }) => size,
		width: ({ size }) => size,
		borderRadius: ({ size }) => size / 2,
		color: theme.onSurface,
		overflow: "hidden",
		cursor: "pointer"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
