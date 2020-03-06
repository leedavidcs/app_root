import { TextInput, Toolbar, Tooltip } from "@/client/components";
import { useAuth, useModal, useSetUser } from "@/client/hooks";
import { onInputValueChanged } from "@/client/utils";
import { Button } from "@blueprintjs/core";
import dynamic from "next/dynamic";
import React, { FC, FormEventHandler, useCallback, useState } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { ProfileMenu } from "./profile-menu.component";
import { useStyles } from "./styles";

const SignInModal = dynamic(() => import("@/client/modals/sign-in.modal"));
const SignUpModal = dynamic(() => import("@/client/modals/sign-up.modal"));

const FA_BARS_SIZE = 20;
const FA_USER_CIRCLE_SIZE = 32;

interface IProps {
	/** Text to be used in the brand */
	title: string;
	/** Invoked on search action from search bar. Passes search text */
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
	const { title } = props;

	const classes = useStyles();

	const { logout } = useAuth();
	const [, { called, loading, user }] = useSetUser();

	const { setContent, toggle } = useModal();

	const [selectedIndex, setSelectedIndex] = useState<number>(-1);

	const onClickSignIn = useCallback(() => {
		setContent({ title: "Sign in", body: <SignInModal /> });
		toggle(true);
	}, [setContent, toggle]);

	const onClickSignUp = useCallback(() => {
		setContent({ title: "Sign up", body: <SignUpModal /> });
		toggle(true);
	}, [setContent, toggle]);

	const onClickProfileIcon = useCallback(
		(index: number) => () => {
			const newIndex: number = selectedIndex === index ? -1 : index;

			setSelectedIndex(newIndex);
		},
		[selectedIndex, setSelectedIndex]
	);

	const closeMenus = useCallback(() => setSelectedIndex(-1), [setSelectedIndex]);

	const [searchText, onSearch] = useOnSearch(props);

	const onClickSignOut = useCallback(() => {
		logout();
		setSelectedIndex(-1);
	}, [logout]);

	const isLoaded: boolean = called && !loading;

	if (isLoaded) {
		return null;
	}

	return (
		<Toolbar className={classes.root} stickTop={true}>
			<div className={classes.contentWrapper}>
				<div className={classes.menuBtnWrapper}>
					<FaBars size={FA_BARS_SIZE} />
				</div>
				<h6 className={classes.title}>{title}</h6>
				<TextInput
					className={classes.searchWrapper}
					icon="search"
					placeholder="Search"
					onChange={onSearch}
					value={searchText}
				/>
				{!user && (
					<div className={classes.authBtnWrapper}>
						<Button className={classes.authBtn} onClick={onClickSignIn} outlined={true}>
							SIGN IN
						</Button>
						<Button
							className={classes.authBtn}
							intent="primary"
							onClick={onClickSignUp}
						>
							SIGN UP
						</Button>
					</div>
				)}
				{user && (
					<Tooltip
						active={selectedIndex === 0}
						direction="left-start"
						onMouseDownOut={closeMenus}
						tooltip={
							<ProfileMenu
								onClickSignIn={onClickSignIn}
								onClickSignOut={onClickSignOut}
								user={user}
							/>
						}
					>
						<FaUserCircle
							onClick={onClickProfileIcon(0)}
							className={classes.profileIcon}
							size={FA_USER_CIRCLE_SIZE}
						/>
					</Tooltip>
				)}
			</div>
		</Toolbar>
	);
};
