import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	interactive: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		width: "100%"
	},
	paper: {
		width: 120,
		padding: 8
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
