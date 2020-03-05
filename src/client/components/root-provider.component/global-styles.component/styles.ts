import { breakpoints, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	"@global": {
		"html, body": {
			height: "100%",
			margin: 0,
			padding: 0,

			"& > div": {
				height: "100%"
			}
		},
		/**
		 * !HACK
		 * @description Chrome puts an ugly big box over text inputs that are autofilled. Hard-code
		 *     styles to prevent that from happening.
		 * @author David Lee
		 * @date February 21, 2020
		 */
		[[
			`input[type="text"]:-webkit-autofill`,
			"input:-webkit-autofill:hover",
			"input:-webkit-autofill:focus",
			"input:-webkit-autofill:active"
		].join(", ")]: {
			"-webkit-box-shadow": [`0 0 0 30px ${theme.surface} inset`, "!important"],
			"-webkit-text-fill-color": theme.onSurface,
			boxSizing: "border-box",
			height: "100%",
			width: "100%",
			borderRadius: 4
		}
	},
	root: {
		boxSizing: "border-box",
		backgroundColor: theme.background,
		height: "100%",

		[breakpoints.up("sm")]: {
			padding: "96px 25px"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
