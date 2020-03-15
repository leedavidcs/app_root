import { withApollo } from "@/client/hocs";
import { NextPage, NextPageContext } from "next";
import React from "react";

const Page: NextPage<NextPageContext> = () => {
	return (
		<main>
			<div>Home page works~!</div>
		</main>
	);
};

export default withApollo({ ssr: false })(Page);
