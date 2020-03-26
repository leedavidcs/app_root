import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex"
	},
	addInputContainers: {
		display: "flex",
		flexGrow: 1
	},
	addTicker: {
		margin: 0
	},
	addColumn: {
		marginLeft: 12
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
