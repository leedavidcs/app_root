import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		fontSize: 14
	},
	meter: {
		display: "flex",
		alignItems: "left",
		height: 8,
		border: {
			width: 1,
			style: "solid",
			color: theme.onSurface
		}
	},
	meterFill: {
		height: "100%",
		backgroundColor: theme.success
	},
	weak: {
		backgroundColor: theme.error
	},
	fair: {
		backgroundColor: theme.warning
	},
	good: {
		backgroundColor: theme.success
	},
	strong: {
		backgroundColor: theme.success
	},
	textWrapper: {
		marginTop: 8
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
