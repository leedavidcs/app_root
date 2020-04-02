import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		alignItems: "center",
		fontFamily: theme.fontPrimary,
		color: theme.onSurface
	},
	withConnector: {
		flexGrow: 1
	},
	connector: {
		display: "flex",
		flexGrow: 1,
		margin: "0 8px",
		borderTop: `1px solid ${theme.disabled}`
	},
	step: {
		display: "flex",
		alignItems: "center"
	},
	iconWrapper: {
		position: "relative"
	},
	icon: {
		height: 24,
		width: 24,
		borderRadius: 12,
		backgroundColor: theme.disabled,
		color: theme.disabled
	},
	iconLegend: {
		position: "absolute",
		transform: "translate(-50%, -50%)",
		top: 12,
		left: 12,
		fontSize: 12
	},
	label: {
		flexGrow: 1,
		margin: 0,
		marginLeft: 8
	},
	textInactive: {
		color: theme.onDisabled
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
