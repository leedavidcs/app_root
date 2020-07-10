import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	"@global": {
		".bp3-popover.bp3-select-popover": {
			"& .bp3-input-group": {
				backgroundColor: theme.code
			},

			"& .bp3-popover-content, .bp3-menu": {
				backgroundColor: theme.surface
			}
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
