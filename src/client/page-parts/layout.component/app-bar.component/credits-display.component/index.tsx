import { AnchorButton } from "@/client/components";
import { useGetUserQuery } from "@/client/graphql";
import React, { FC } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
}

export const CreditsDisplay: FC<IProps> = ({ className }) => {
	useStyles();

	const getUserQuery = useGetUserQuery({ fetchPolicy: "cache-only" });
	const currentBalance: number = getUserQuery.data?.user?.balance?.credits ?? 0;

	return (
		<AnchorButton
			className={className}
			href="/pricing"
			icon="cube"
			minimal={true}
			text={`${currentBalance} credits`}
		/>
	);
};
