import { useGetUserQuery } from "@/client/graphql";
import { AnchorButton } from "@blueprintjs/core";
import Link from "next/link";
import React, { FC } from "react";
import { useStyles } from "./styles";

interface IProps {
	className?: string;
}

export const CreditsDisplay: FC<IProps> = ({ className }) => {
	useStyles();

	const getUserQuery = useGetUserQuery();
	const currentBalance: number = getUserQuery.data?.user?.balance?.credits ?? 0;

	return (
		<Link href="/pricing" passHref={true}>
			<AnchorButton
				className={className}
				icon="cube"
				minimal={true}
				text={`${currentBalance} credits`}
			/>
		</Link>
	);
};
