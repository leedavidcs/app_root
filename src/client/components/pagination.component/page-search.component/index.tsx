import { TextInput } from "@/client/components/input.component";
import { Interactable } from "@/client/components/interactable.component";
import { IPaginationProps } from "@/client/components/pagination.component";
import {
	getCurrentPage,
	getPageCount,
	getSkipFromPage
} from "@/client/components/pagination.component/get-page-info";
import { Paper } from "@/client/components/paper.component";
import { Tooltip } from "@/client/components/tooltip.component";
import Keycode from "keycode";
import React, { FC, FormEvent, KeyboardEvent, useCallback, useMemo, useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { useStyles } from "./styles";

interface IProps extends IPaginationProps {
	onPage: (props: IPaginationProps) => void;
}

export const PageSearch: FC<IProps> = ({ count, first, skip, onPage }) => {
	const classes = useStyles();

	const [active, setActive] = useState<boolean>(false);

	const pageCount: number = useMemo(() => getPageCount({ count, first }), [count, first]);
	const currentPage: number = useMemo(() => getCurrentPage({ first, skip }), [first, skip]);

	const [value, setValue] = useState<number>(currentPage + 1);

	const onClick = useCallback(() => setActive(!active), [active, setActive]);
	const onClickOut = useCallback(() => setActive(false), [setActive]);

	const onChange = useCallback(
		({ currentTarget }: FormEvent<HTMLInputElement>) => setValue(parseInt(currentTarget.value)),
		[setValue]
	);

	const onKeyDown = useCallback(
		({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
			if (keyCode !== Keycode.codes.enter) {
				return;
			}

			onPage({ count, first, skip: getSkipFromPage(value - 1, first) });
		},
		[count, first, onPage, value]
	);

	return (
		<Tooltip
			active={active}
			tooltip={
				<Paper className={classes.paper}>
					<TextInput
						type="number"
						label="Go to page"
						max={pageCount}
						min={1}
						value={value.toString()}
						onChange={onChange}
						onKeyDown={onKeyDown}
					/>
				</Paper>
			}
			direction="bottom"
			onClickOut={onClickOut}
		>
			<Interactable className={classes.interactive} onClick={onClick}>
				<FaEllipsisH />
			</Interactable>
		</Tooltip>
	);
};
