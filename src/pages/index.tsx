import { AppBar } from "@/client/components";
import { NextComponentType } from "next";
import React from "react";

const IndexPage: NextComponentType = () => {
	return (
		<main>
			<AppBar title="TheBrand Inc." />
			<div>Home page works~!</div>
		</main>
	);
};

export default IndexPage;
