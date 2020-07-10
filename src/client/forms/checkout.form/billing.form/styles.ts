import { breakpoints, colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		padding: 8,

		"& h3": {
			padding: 10,
			margin: 0,
			borderBottom: `1px solid ${colors.gray1}`
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
	orderSummary: {
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
