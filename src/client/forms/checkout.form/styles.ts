import { CustomTheme } from "@/client/themes";
import { Colors } from "@blueprintjs/core";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	form: {
		width: 600,
		padding: "0 20px",

		"& h3": {
			padding: 10,
			margin: 0,
			borderBottom: `1px solid ${Colors.GRAY1}`
		}
	},
	section: {
		padding: 0,

		"&:not(:first-child) .bp3-label": {
			width: 130,
			textAlign: "right"
		}
	},
	sectionContent: {
		padding: 10,

		"& .bp3-radio": {
			fontSize: 14,
			fontWeight: 500
		}
	},
	cardDetailsContainer: {
		padding: "16px 0"
	},
	payBtn: {
		padding: "0 30px"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
