import { Brand, Popover, SearchInput } from "@/client/components";
import { useAuth, useSetUser } from "@/client/hooks";
import { onInputValueChanged } from "@/client/utils";
import { Alignment, Classes, ControlGroup, Icon, Navbar } from "@blueprintjs/core";
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

const useOnClickSignOut = (onCompleted?: () => void) => {
	const { logout } = useAuth();

	return useCallback(() => {
		logout();
		onCompleted?.();
	}, [logout, onCompleted]);
};

const useOnClickProfileIcon = (): [boolean, { onOpen: () => void; onClose: () => void }] => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	return [isOpen, { onOpen, onClose }];
};

export const AppBar: FC<IProps> = (props) => {
	const { icon } = props;

	const classes = useStyles();

	const [, { user }] = useSetUser();

	const [searchText, onSearchChange] = useOnSearch(props);
	const [isOpen, { onOpen, onClose }] = useOnClickProfileIcon();

	const onClickSignOut = useOnClickSignOut(onClose);

	return (
		<Navbar className={classes.root} fixedToTop={true}>
			<Navbar.Group
				className={classnames(classes.group, Classes.DARK)}
				align={Alignment.LEFT}
			>
				{icon &&
					React.cloneElement(icon, {
						className: classnames(classes.icon, icon.props.className),
						outlined: true
					})}
				<Navbar.Heading className={classes.title}>
					<Brand />
				</Navbar.Heading>
				<ControlGroup className={classes.searchWrapper}>
					<SearchInput onChange={onSearchChange} value={searchText} />
				</ControlGroup>
				{user ? (
					<Popover
						isOpen={isOpen}
						position="left-top"
						onClose={onClose}
						content={<ProfileMenu onClickSignOut={onClickSignOut} />}
					>
						<Icon
							className={classes.profileIcon}
							icon="user"
							onClick={onOpen}
							iconSize={24}
						/>
					</Popover>
				) : (
					<AuthButtons />
				)}
			</Navbar.Group>
		</Navbar>
	);
};
