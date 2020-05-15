import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		marginLeft: 0,
		marginRight: 0,
		borderBottom: `1px solid ${theme.divider}`,
		borderRight: `1px solid ${theme.divider}`
	},
	inset: {
		marginLeft: 38
	},
	middle: {
		marginLeft: 16,
		marginRight: 16
	},
	spaced: {
		margin: 5
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
