import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex"
	},
	addTickerInput: {
		flexGrow: 1,
		margin: 0,

		"& .bp3-input-group": {
			width: 100
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
