import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		height: "100%"
	},
	content: {
		paddingTop: 72,
		flex: "1 0 auto"
	},
	footer: {
		marginTop: 32,
		flexShrink: 0
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
