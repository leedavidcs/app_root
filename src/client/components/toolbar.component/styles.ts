import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: ({ stickTop }) => (stickTop ? "fixed" : "static"),
		top: 0,
		left: 0,
		height: 56,
		width: "100%",
		backgroundColor: theme.primary,
		boxShadow: [
			"0px 2px 4px -1px rgba(0,0,0,0.2)",
			"0px 4px 5px 0px rgba(0,0,0,0.14)",
			"0px 1px 10px 0px rgba(0,0,0,0.12)"
		].join()
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
