import { withApollo } from "@/client/hocs";
import { NextPage } from "next";
import React from "react";

const Page: NextPage = () => {
	return (
		<main>
			<div>Home page works~!</div>
		</main>
	);
};

export default withApollo({ ssr: false })(Page);
