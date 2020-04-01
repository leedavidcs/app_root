import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {},
	form: {
		maxWidth: 320
	},
	btnContainer: {
		paddingTop: 8
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
