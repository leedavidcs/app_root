import { Paper } from "@/client/components";
import { SignInForm } from "@/client/forms";
import { withApollo } from "@/client/hocs";
import { CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

const BRAND_NAME = process.env.BRAND_NAME;

const styles = (theme: CustomTheme) => ({
	root: {},
	formWrapper: {
		width: 340,
		margin: "0 auto",
		fontFamily: theme.fontPrimary,
		color: theme.onBackground
	},
	formHeader: {
		fontSize: 24,
		textAlign: "center"
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage = () => {
	const classes = useStyles();

	return (
		<main>
			<div className={classes.formWrapper}>
				<h3 className={classes.formHeader}>Sign in to {BRAND_NAME}</h3>
				<Paper>
					<SignInForm />
				</Paper>
			</div>
		</main>
	);
};

export default withApollo({ layout: false, ssr: false })(Page);
