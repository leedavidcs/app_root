import { CheckoutForm } from "@/client/forms";
import { withAuth } from "@/client/hocs";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

const styles = (theme: CustomTheme) => ({
	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage = () => {
	const classes = useStyles();

	return (
		<main className={classes.root}>
			<CheckoutForm />
		</main>
	);
};

export default withAuth()(Page);
