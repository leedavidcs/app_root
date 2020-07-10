import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	timepicker: {
		"&.bp3-timepicker .bp3-timepicker-input-row": {
			backgroundColor: theme.code
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
