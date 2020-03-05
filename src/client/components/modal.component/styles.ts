import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "fixed",
		top: "0%",
		left: "50%",
		transform: "translate(-50%, -110%)",
		padding: 0,
		width: 680,
		maxHeight: "75%",
		transition: ({ transition }) => `all ${transition}ms ease`,
		fontFamily: theme.fontPrimary,
		opacity: 0
	},
	"@media (max-width: 768px)": {
		root: {
			width: "100%"
		}
	},
	active: {
		top: "50%",
		transform: "translate(-50%, -50%)",
		opacity: 1
	},
	title: {
		height: 36,
		position: "relative",
		borderBottom: {
			width: 1,
			style: "solid",
			color: "#d3d3d3"
		},
		textAlign: "center",
		lineHeight: "36px"
	},
	content: {
		padding: "0 20px 20px"
	},
	closeBtn: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		position: "absolute",
		top: "50%",
		right: 0,
		transform: "translate(-50%, -50%)",
		cursor: "pointer"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
