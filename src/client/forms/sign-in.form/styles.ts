import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		paddingTop: 20
	},
	btnContainer: {
		paddingTop: 8
	},
	formWrapper: {
		maxWidth: 320
	},
	textInput: {
		marginBottom: 16
	},
	successSignIn: {
		marginTop: 10,
		marginBottom: 18,
		fontSize: 14
	},
	forgotPassword: {
		marginTop: 10
	},
	signUpWrapper: {
		marginTop: 28,
		fontSize: 14
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
