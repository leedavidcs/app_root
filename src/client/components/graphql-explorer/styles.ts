import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		height: 500,
		width: 800,
		border: `1px solid ${colors.darkGray4}`,
		fontFamily: [theme.fontPrimary, "!important"],

		"& .topBarWrap": {
			height: 32,
			borderBottom: `1px solid ${theme.onSurface}`,
			backgroundColor: theme.code,
			color: theme.onSurface,

			"& > .topBar": {
				borderBottom: "none",
				background: "unset",

				"& .title": {
					fontSize: 16
				}
			},

			"& >.docExplorerShow": {
				display: "flex",
				alignItems: "center",
				boxSizing: "border-box",
				border: "none",
				borderLeft: `1px solid ${colors.darkGray2}`,
				background: "unset",
				color: theme.onSurface,

				"&:hover": {
					backgroundColor: "rgba(138, 155, 168, 0.15)"
				},

				"&:before": {
					borderColor: theme.onSurface
				}
			}
		},

		"& .CodeMirror-gutters": {
			zIndex: "unset"
		},

		"& .doc-explorer": {
			display: "flex",
			height: 32,
			padding: 0,
			borderLeft: `1px solid ${colors.darkGray2}`,
			backgroundColor: theme.code,
			color: theme.onSurface,
			fontFamily: [theme.fontPrimary, "!important"],

			"& .doc-explorer-back": {
				paddingLeft: 12,
				margin: 0,
				borderRight: `1px solid ${colors.darkGray2}`,
				color: theme.onSurface,
				background: "unset",

				"&:hover": {
					backgroundColor: "rgba(138, 155, 168, 0.15)"
				},

				"&:before": {
					borderColor: theme.onSurface
				}
			},

			"& .doc-explorer-title-bar": {
				padding: 0,
				flexGrow: 1,
				height: 32
			},

			"& .doc-explorer-title": {
				overflowX: "unset",
				height: 32
			},

			"& .doc-explorer-rhs": {
				display: "flex",

				"& .docExplorerHide": {
					width: 32,
					padding: 0,
					margin: 0,
					borderLeft: `1px solid ${colors.darkGray2}`,
					background: "unset",
					backgroundColor: "unset",
					color: theme.onSurface,

					"&:hover": {
						backgroundColor: "rgba(138, 155, 168, 0.15)"
					}
				}
			}
		},

		"& .execute-button-wrap, .resultWrap, .variable-editor": {
			display: "none"
		},

		"& .CodeMirror-cursor": {
			borderColor: [theme.onSurface, "!important"]
		},

		"& .doc-explorer-contents": {
			top: 31,
			borderTop: `1px solid ${theme.onSurface}`,
			borderLeft: `1px solid ${colors.darkGray2}`,
			backgroundColor: "#262626",

			"& .search-box": {
				marginTop: 8,

				"& > .search-box-icon": {
					top: 0,
					left: 8,
					color: colors.gray3
				},

				'& > input[type="text"]': {
					paddingLeft: 32,
					backgroundColor: theme.code
				}
			},

			"& .doc-type-description": {
				color: theme.onSurface
			}
		}
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
