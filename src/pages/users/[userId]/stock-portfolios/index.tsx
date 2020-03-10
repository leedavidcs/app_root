import { CustomTheme } from "@/client/themes";
import { NextComponentType } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles, {
	link: true
});

export const Page: NextComponentType = () => {
	useStyles();

	return <div />;
};

export default Page;
