import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative"
	},
	detailsContainer: {
		marginBottom: 24,

		[breakpoints.up("sm")]: {
			padding: "0 25px"
		}
	},
	tabs: {
		position: "relative",
		top: 1,

		[breakpoints.up("sm")]: {
			padding: "0 25px"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
