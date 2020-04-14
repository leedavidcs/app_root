import { AnchorButton, ButtonGroup, Divider } from "@blueprintjs/core";
import classnames from "classnames";
import { format } from "date-fns";
import Link from "next/link";
import React, { CSSProperties, FC, useMemo } from "react";
import { useStyles } from "./styles";

const brandName: string = process.env.BRAND_NAME || "";

interface IProps {
	className?: string;
	style?: CSSProperties;
}

export const AppFooter: FC<IProps> = ({ className, style }) => {
	const classes = useStyles();

	const currentYear: string = useMemo(() => format(new Date(), "yyyy"), []);

	return (
		<footer className={classnames(classes.root, className)} style={style}>
			<div className={classes.iexAttribution}>
				<AnchorButton
					href="https://iexcloud.io"
					minimal={true}
					text="* Data provided by IEX Cloud"
				/>
			</div>
			<section className={classes.main}>
				<div className={classes.brand}>
					<div>
						&copy;&nbsp;
						<Link href="/">
							<a>{brandName}</a>
						</Link>
						&nbsp;{currentYear}
					</div>
				</div>
				<ButtonGroup>
					<AnchorButton href="/terms" minimal={true} text="Terms of Service" />
					<Divider className={classes.divider} />
					<AnchorButton href="/privacy" minimal={true} text="Privacy Policy" />
				</ButtonGroup>
			</section>
		</footer>
	);
};
