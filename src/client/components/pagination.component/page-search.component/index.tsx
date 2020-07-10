import { Icon } from "@/client/components/icon.component";
import { NumberInput } from "@/client/components/input.component";
import { Interactable } from "@/client/components/interactable.component";
import { IPaginationProps, OnPageProps } from "@/client/components/pagination.component";
import {
	getCurrentPage,
	getPageCount,
	getSkipFromPage
} from "@/client/components/pagination.component/get-page-info";
import { Paper } from "@/client/components/paper.component";
import { Popover } from "@/client/components/popover.component";
import Keycode from "keycode";
import React, { FC, KeyboardEvent, useCallback, useMemo, useState } from "react";
import { useStyles } from "./styles";

interface IProps extends IPaginationProps {
	onPage: (props: OnPageProps) => void;
}

export const PageSearch: FC<IProps> = ({
	count,
	first: _first,
	take: _take = _first,
	skip,
	onPage
}) => {
	const first: number | undefined = _take;
	const take: number | undefined = _take;

	if (typeof first !== "number" || typeof take !== "number") {
		throw new Error("Must define either first or take in PageSearch component!");
	}

	const classes = useStyles();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const pageCount: number = useMemo(() => getPageCount({ count, first }), [count, first]);
	const currentPage: number = useMemo(() => getCurrentPage({ first, skip }), [first, skip]);

	const [value, setValue] = useState<number>(currentPage + 1);

	const onClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);
	const onClose = useCallback(() => setIsOpen(false), [setIsOpen]);

	const onValueChange = useCallback((numberValue: number) => setValue(numberValue), [setValue]);

	const onKeyDown = useCallback(
		({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
			if (keyCode !== Keycode.codes.enter) {
				return;
			}

			onPage({ count, first, take, skip: getSkipFromPage(value - 1, first) });
		},
		[count, first, onPage, take, value]
	);

	return (
		<Popover
			className={classes.root}
			popoverClassName={classes.popover}
			isOpen={isOpen}
			onClose={onClose}
			position="bottom"
			content={
				<Paper className={classes.paper}>
					<NumberInput
						label="Go to page"
						max={pageCount}
						onKeyDown={onKeyDown}
						onValueChange={onValueChange}
						value={value}
					/>
				</Paper>
			}
		>
			<Interactable className={classes.interactive} onClick={onClick}>
				<Icon icon="more" />
			</Interactable>
		</Popover>
	);
};
