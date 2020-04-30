import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	section: {
		padding: 8,

		"& .bp3-form-group": {
			maxWidth: 280
		}
	},
	scheduleCard: {
		marginTop: 12
	},
	formBtnGroup: {
		marginTop: 20
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
