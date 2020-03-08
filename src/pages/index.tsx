import { withApollo } from "@/client/hocs";
import { NextComponentType } from "next";
import React from "react";

const Page: NextComponentType = () => {
	return (
		<main>
			<div>Home page works~!</div>
		</main>
	);
};

export default withApollo()(Page);
