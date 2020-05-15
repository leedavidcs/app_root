import { Icon } from "@/client/components/icon.component";
import { NumberInput } from "@/client/components/input.component";
import { Interactable } from "@/client/components/interactable.component";
import { IPaginationProps } from "@/client/components/pagination.component";
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
	onPage: (props: IPaginationProps) => void;
}

export const PageSearch: FC<IProps> = ({ count, first, skip, onPage }) => {
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

			onPage({ count, first, skip: getSkipFromPage(value - 1, first) });
		},
		[count, first, onPage, value]
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
