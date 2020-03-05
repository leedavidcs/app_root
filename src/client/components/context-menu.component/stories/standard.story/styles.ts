import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex"
	},
	wrapper: {
		flexGrow: 1,
		border: "1px solid gray"
	},
	menu1: {
		height: ({ menuSize }) => menuSize,
		width: ({ menuSize }) => menuSize,
		backgroundColor: "red"
	},
	menu2: {
		height: ({ menuSize }) => menuSize,
		width: ({ menuSize }) => menuSize,
		backgroundColor: "blue"
	},
	clickArea: {
		height: ({ clickAreaSize }) => clickAreaSize,
		width: ({ clickAreaSize }) => clickAreaSize
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
