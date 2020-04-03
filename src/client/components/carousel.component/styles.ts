import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		height: 250,
		width: 720,
		position: "relative"
	},
	content: {
		height: "100%",
		width: "100%",
		position: "relative",
		overflow: "hidden"
	},
	contentSlide: {
		height: "100%",
		transition: "transform 300ms ease"
	},
	dots: {
		display: "flex",
		justifyContent: "center",
		margin: 0,
		padding: 0,
		position: "absolute",
		bottom: 0,
		left: "50%",
		transform: "translateX(-50%)",
		listStyleType: "none",

		"& > li": {
			margin: "0 4px",
			cursor: "pointer"
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
