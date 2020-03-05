import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "inline-flex"
	},
	reference: {
		height: "100%",
		width: "100%"
	},
	popper: {
		position: "absolute",
		display: ({ active }) => (active ? "block" : "none")
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
