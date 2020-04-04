import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		padding: 8,
		textAlign: "center",

		"& > h1": {
			margin: "10px 0",

			"& + p": {
				fontSize: 18
			}
		}
	},
	bundlesContainer: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
		gridGap: 16
	},
	priceBundle: {
		display: "flex",
		flexDirection: "column",
		height: "100%",
		padding: 0
	},
	priceBundleContent: {
		flexGrow: 1,
		textAlign: "center",

		"& > h2": {
			margin: "10px 0"
		}
	},
	priceBundleBtnContainer: {
		display: "flex",
		justifyContent: "center"
	},
	priceBundleBtn: {
		width: 80,
		margin: 16,
		fontWeight: "bold"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
