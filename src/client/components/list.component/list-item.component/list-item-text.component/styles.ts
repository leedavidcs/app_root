import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		flex: "1 1 auto",
		minWidth: 0,
		marginTop: 4,
		marginBottom: 4
	},
	multiline: {
		margin: "6px 0"
	},
	secondary: {
		marginTop: 4,
		fontSize: 12
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
