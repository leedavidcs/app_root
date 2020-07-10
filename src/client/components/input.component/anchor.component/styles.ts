import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "inline-flex",
		margin: 0,
		padding: 0,
		border: "none",
		outline: "none",
		fontSize: 14,
		color: theme.link,
		cursor: "pointer",
		backgroundColor: theme.transparent,
		textDecoration: "none"
	},
	focused: {
		textDecoration: "underline"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
