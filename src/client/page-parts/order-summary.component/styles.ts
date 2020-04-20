import { CustomTheme } from "@/client/themes";
import { Colors } from "@blueprintjs/core";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		padding: 0,

		"& h3": {
			padding: 10,
			margin: 0,
			borderBottom: `1px solid ${Colors.GRAY1}`
		},

		"& .bp3-label": {
			width: 130,
			textAlign: "right"
		}
	},
	content: {
		padding: 10
	},
	summary: {
		marginTop: 10,
		padding: 10,
		borderTop: `1px solid ${theme.onSurface}`
	},
	totalPriceContainer: {
		display: "flex"
	},
	totalPrice: {
		flexGrow: 1,
		textAlign: "right"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
