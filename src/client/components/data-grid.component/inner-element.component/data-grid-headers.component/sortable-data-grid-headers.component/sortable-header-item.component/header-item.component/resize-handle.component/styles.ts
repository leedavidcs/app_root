import { CustomTheme } from "@/client/themes";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		position: "absolute",
		top: 0,
		right: 0,
		minWidth: 10,
		height: "100%",
		transform: "translateX(50%)",
		zIndex: 1,
		cursor: "col-resize"
	}
});

export const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);
