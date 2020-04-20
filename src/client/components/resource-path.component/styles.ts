import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		fontFamily: theme.fontPrimary,
		fontWeight: "unset"
	},
	icon: {
		marginRight: 4
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
