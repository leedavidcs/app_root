import { breakpoints, CustomTheme } from "@/client/themes";
import { Colors } from "@blueprintjs/core";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		padding: 8,

		"& h3": {
			padding: 10,
			margin: 0,
			borderBottom: `1px solid ${Colors.GRAY1}`
		}
	},
	container: {
		[breakpoints.up("sm")]: {
			display: "flex"
		}
	},
	inputsContainer: {
		flexGrow: 1
	},
	section: {
		padding: 0,

		"& .bp3-label": {
			width: 130,
			textAlign: "right"
		}
	},
	sectionContent: {
		padding: 10
	},
	orderDetails: {
		composes: "$section",

		flexBasis: 300,
		height: "max-content",
		maxHeight: 500,

		[breakpoints.up("sm")]: {
			marginLeft: 16
		}
	},
	totalAndSubmit: {
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
	},
	reviewOrderBtnContainer: {
		marginTop: 24,
		display: "flex",
		justifyContent: "center"
	},
	reviewOrderBtn: {
		width: 120
	},
	backBtn: {
		width: 80
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
