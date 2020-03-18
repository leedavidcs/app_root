import { Popover, TextInput } from "@/client/components";
import { useAuth, useModal, useSetUser } from "@/client/hooks";
import { onInputValueChanged } from "@/client/utils";
import { Alignment, Button, Classes, ControlGroup, Icon, Navbar } from "@blueprintjs/core";
import classnames from "classnames";
import dynamic from "next/dynamic";
import { NextRouter, useRouter } from "next/router";
import React, { FC, FormEventHandler, Fragment, ReactElement, useCallback, useState } from "react";
import { ProfileMenu } from "./profile-menu.component";
import { useStyles } from "./styles";

const SignInModal = dynamic(() => import("@/client/modals/sign-in.modal"));
const SignUpModal = dynamic(() => import("@/client/modals/sign-up.modal"));

interface IProps {
	icon?: ReactElement;
	onSearch?: (text: string) => void;
	title: string;
	withMock?: boolean;
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

const useOnClickSignIn = () => {
	const { setContent, toggle } = useModal();

	return useCallback(() => {
		setContent({ title: "Sign in", body: <SignInModal /> });
		toggle(true);
	}, [setContent, toggle]);
};

const useOnClickSignUp = () => {
	const { setContent, toggle } = useModal();

	return useCallback(() => {
		setContent({ title: "Sign up", body: <SignUpModal /> });
		toggle(true);
	}, [setContent, toggle]);
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

const useOnClickBrand = () => {
	const router: NextRouter = useRouter();

	return useCallback(() => {
		router.push("/");
	}, [router]);
};

export const AppBar: FC<IProps> = (props) => {
	const { icon, title, withMock } = props;

	const classes = useStyles();

	const [, { user }] = useSetUser();

	const [searchText, onSearchChange] = useOnSearch(props);
	const [isOpen, { onOpen, onClose }] = useOnClickProfileIcon();

	const onClickSignIn = useOnClickSignIn();
	const onClickSignUp = useOnClickSignUp();
	const onClickSignOut = useOnClickSignOut(onClose);
	const onClickBrand = useOnClickBrand();

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
				<Navbar.Heading className={classes.title} onClick={onClickBrand}>
					{title}
				</Navbar.Heading>
				<ControlGroup className={classes.searchWrapper}>
					<TextInput
						className={classes.search}
						icon="search"
						placeholder="Search"
						onChange={onSearchChange}
						value={searchText}
					/>
					<Button icon="arrow-right" />
				</ControlGroup>
				{user || withMock ? (
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
					<Fragment>
						<Button
							className={classes.authBtn}
							text="SIGN IN"
							outlined={true}
							onClick={onClickSignIn}
						/>
						<Button
							className={classes.authBtn}
							text="SIGN UP"
							intent="primary"
							onClick={onClickSignUp}
						/>
					</Fragment>
				)}
			</Navbar.Group>
		</Navbar>
	);
};
