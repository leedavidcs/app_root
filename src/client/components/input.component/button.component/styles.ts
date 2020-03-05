import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

/* eslint-disable no-magic-numbers */
export const styles = (theme: CustomTheme) => {
	return {
		root: {
			position: "relative",
			display: "inline-flex",
			justifyContent: "center",
			flexDirection: "column",
			alignItems: "center",
			boxSizing: "borderBox",
			height: 36,
			padding: "0 16px",
			margin: 0,
			border: {
				width: 1,
				style: "solid",
				radius: 4
			},
			outline: "none",
			backgroundColor: ({ color }) => theme[color],
			textAlign: "center",
			fontFamily: theme.fontPrimary,
			fontSize: "0.8125rem",
			fontWeight: "bold",
			letterSpacing: "0.02857em",
			cursor: "pointer"
		},
		small: {
			height: 30,
			padding: "0 10px"
		},
		large: {
			height: 42,
			padding: "0 22px"
		},
		rippleContainer: {
			position: "absolute",
			top: 0,
			left: 0,
			height: "100%",
			width: "100%"
		}
	};
};

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
