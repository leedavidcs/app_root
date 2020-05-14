import { colors, CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		height: 500,
		width: 800,
		fontFamily: [theme.fontPrimary, "!important"],

		"& .topBarWrap": {
			backgroundColor: theme.primary,
			color: theme.onPrimary,
			fontWeight: 600,

			"& > .topBar": {
				height: 48,
				borderBottom: "none",
				background: "unset"
			},

			"& >.docExplorerShow": {
				boxSizing: "border-box",
				height: 30,
				margin: "auto 8px"
			}
		},

		"& .doc-explorer": {
			backgroundColor: theme.primary,
			color: theme.onPrimary,

			"& .doc-explorer-title-bar": {
				height: 48
			},

			"& .doc-explorer-title": {
				overflowX: "unset"
			}
		},

		"& .execute-button-wrap, .resultWrap, .variable-editor": {
			display: "none"
		},

		"& .CodeMirror-cursor": {
			borderColor: [theme.onSurface, "!important"]
		},

		"& .doc-explorer-contents": {
			backgroundColor: theme.surface,

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
