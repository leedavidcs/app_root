import { CustomTheme, getZIndex } from "@/client/themes";
import { timingFunctions, transparentize } from "polished";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	underlined: {},
	outlined: {},
	root: {
		position: "relative",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		height: 30,
		borderWidth: 1,
		borderStyle: "solid",
		borderTopColor: "transparent",
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
		borderBottomColor: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
		borderRadius: "unset",
		backgroundColor: theme.surface,
		fontFamily: theme.fontPrimary,
		fontWeight: 400,
		transition: `border 0.3s ${timingFunctions("easeOutQuint")}`,

		"&$outlined": {
			borderTopColor: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
			borderLeftColor: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
			borderRightColor: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
			borderRadius: 4
		}
	},
	focused: {
		"&:not($invalid)": {
			borderTopColor: "transparent",
			borderLeftColor: "transparent",
			borderRightColor: "transparent",
			borderBottomColor: theme.secondaryVariant,

			"&$outlined": {
				borderTopColor: theme.secondaryVariant,
				borderLeftColor: theme.secondaryVariant,
				borderRightColor: theme.secondaryVariant
			}
		}
	},
	label: {
		display: "inline-block",
		position: "absolute",
		top: 8,
		left: 12,
		fontSize: "1rem",
		fontWeight: 400,
		color: transparentize(1 - theme.mediumEmphasis, theme.onSurface),
		transition: `all 0.3s ${timingFunctions("easeOutQuint")}`,
		userSelect: "none"
	},
	labelActive: {
		top: 0,
		left: 8,
		padding: "0 4px",
		transform: "translate(0, -50%)",
		backgroundColor: theme.surface,
		fontSize: "0.625rem",
		fontWeight: 700,
		color: transparentize(1 - theme.highEmphasis, theme.onSurface),
		zIndex: getZIndex("text-input-label")
	},
	startIconWrapper: {
		display: "flex",
		marginLeft: 12
	},
	textInputWrapper: {
		position: "relative",
		display: "flex",
		height: "100%",
		flexGrow: 1,
		alignItems: "center"
	},
	textInput: {
		position: "relative",
		display: "block",
		width: "100%",
		height: 36,
		border: "none",
		paddingLeft: 12,
		margin: 0,
		outline: "none",
		backgroundColor: "rgba(0, 0, 0, 0)",
		color: theme.onSurface
	},
	invalid: {
		color: theme.warning,
		borderTopColor: "transparent",
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
		borderBottomColor: theme.error,

		"&$outlined": {
			borderTopColor: theme.error,
			borderLeftColor: theme.error,
			borderRightColor: theme.error
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});
