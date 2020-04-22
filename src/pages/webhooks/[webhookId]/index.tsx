import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		maxWidth: 800,
		margin: "0 auto",
		color: theme.onBackground
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage = () => {
	const classes = useStyles();

	return <main className={classes.root}>Webhook page works~!</main>;
};

export default Page;
