import { Brand, SearchInput } from "@/client/components";
import { useGetUserQuery } from "@/client/graphql";
import { onInputValueChanged } from "@/client/utils";
import { Alignment, Classes, Navbar } from "@blueprintjs/core";
import classnames from "classnames";
import React, { FC, FormEventHandler, ReactElement, useCallback, useState } from "react";
import { AuthButtons } from "./auth-buttons.component";
import { ProfileMenu } from "./profile-menu.component";
import { useStyles } from "./styles";

interface IProps {
	icon?: ReactElement;
	onSearch?: (text: string) => void;
}

const useOnSearch = ({ onSearch }: IProps): [string, FormEventHandler<HTMLInputElement>] => {
	const [searchText, setSearchText] = useState<string>("");

	return [
		searchText,
		useCallback(
			onInputValueChanged((value) => {
				onSearch?.(value);
				setSearchText(value);
			}),
			[onSearch, setSearchText]
		)
	];
};

export const AppBar: FC<IProps> = (props) => {
	const { icon } = props;

	const classes = useStyles();

	const { data } = useGetUserQuery();

	const [searchText, onSearchChange] = useOnSearch(props);

	return (
		<Navbar className={classes.root} fixedToTop={true}>
			<Navbar.Group
				className={classnames(classes.group, Classes.DARK)}
				align={Alignment.LEFT}
			>
				{icon}
				<Navbar.Heading className={classes.title}>
					<Brand />
				</Navbar.Heading>
				<SearchInput onChange={onSearchChange} value={searchText} />
				{data?.user ? <ProfileMenu /> : <AuthButtons />}
			</Navbar.Group>
		</Navbar>
	);
};
