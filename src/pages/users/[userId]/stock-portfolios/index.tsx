import { withAuth } from "@/client/hocs";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage = () => {
	useStyles();

	return <div />;
};

export default withAuth()(Page);
