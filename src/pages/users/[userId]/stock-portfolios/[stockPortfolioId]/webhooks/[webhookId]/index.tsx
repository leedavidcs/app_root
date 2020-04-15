import { withAuth } from "@/client/hocs";
import { NextPage } from "next";
import React from "react";

const Page: NextPage = () => {
	return <main>Webhook edit page works~!</main>;
};

export default withAuth()(Page);
