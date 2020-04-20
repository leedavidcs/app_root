import { breakpoints, colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "relative",
		borderBottom: `1px solid ${colors.gray3}`
	},
	detailsContainer: {
		maxWidth: 1280,
		margin: "0 auto 28px",

		[breakpoints.up("sm")]: {
			padding: "0 25px"
		}
	},
	tabs: {
		position: "relative",
		top: 1,
		maxWidth: 1280,
		margin: "0 auto",

		[breakpoints.up("sm")]: {
			padding: "0 25px"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
