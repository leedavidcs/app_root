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

		"& .bp3-form-group": {
			alignItems: "center",
			margin: 0
		},

		"& .bp3-label": {
			width: 130,
			textAlign: "right"
		},

		"& .bp3-form-content": {
			fontWeight: "bold"
		}
	},
	sectionContent: {
		padding: 10
	},
	creditCardDetails: {
		display: "flex"
	},
	creditCard: {
		marginLeft: 8
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
	payBtnContainer: {
		marginTop: 24,
		display: "flex",
		justifyContent: "center"
	},
	backBtn: {
		width: 80
	},
	payBtn: {
		width: 120
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
