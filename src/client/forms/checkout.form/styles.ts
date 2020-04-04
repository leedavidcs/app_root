import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		width: "100%",
		maxWidth: 800
	},
	carouselContainer: {
		display: "flex",
		width: "100%"
	},
	carousel: {
		flexBasis: 800,
		height: "unset"
	},
	priceBundleForm: {
		marginTop: 72
	},
	billingForm: {
		marginTop: 48
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
