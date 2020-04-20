import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	loadName: {
		height: 16,
		maxWidth: 160
	},
	loadDate: {
		height: 12,
		maxWidth: 200
	},
	createNewItem: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: 65
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
