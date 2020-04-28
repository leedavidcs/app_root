import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		"& .bp3-tag-input.bp3-input, .bp3-tag-input.bp3-input.bp3-active": {
			backgroundColor: theme.code
		}
	},
	"@global": {
		".bp3-popover.bp3-multi-select-popover": {
			"& .bp3-popover-content, .bp3-menu": {
				backgroundColor: theme.surface
			}
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
