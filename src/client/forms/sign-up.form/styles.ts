import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

export const styles = (theme: CustomTheme) => ({
	root: {
		paddingTop: 20
	},
	formWrapper: {
		maxWidth: 320
	},
	btnContainer: {
		paddingTop: 8
	},
	textInput: {
		marginBottom: 16
	},
	passwordStrength: {
		marginBottom: 20
	},
	error: {
		marginTop: 10,
		color: theme.error,
		fontSize: 14
	},
	signInWrapper: {
		marginTop: 28,
		fontSize: 14
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
