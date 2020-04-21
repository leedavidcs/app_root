import { GetOneStockPortfolioQuery, GetWebhooksQuery, useGetWebhooksQuery } from "@/client/graphql";
import { withStockPortfolioAuth } from "@/client/hocs";
import { StockPortfolioHead, StockPortfolioSettings, WebhookList } from "@/client/page-parts";
import { breakpoints, colors, CustomTheme } from "@/client/themes";
import { AnchorButton } from "@blueprintjs/core";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import { createUseStyles } from "react-jss";

type StockPortfolio = NonNullable<GetOneStockPortfolioQuery["stockPortfolio"]>;
type Webhook = GetWebhooksQuery["webhooks"][number];

interface IProps {
	stockPortfolio: StockPortfolio;
}

const styles = (theme: CustomTheme) => ({
	root: {
		color: theme.onBackground
	},
	head: {
		marginBottom: 24,
		borderBottom: `1px solid ${colors.darkGray4}`,

		"& > *": {
			margin: "auto",
			maxWidth: 980
		}
	},
	container: {
		display: "flex",
		maxWidth: 980,
		margin: "0 auto",

		[breakpoints.up("sm")]: {
			padding: "0 25px"
		}
	},
	content: {
		flexGrow: 1,
		marginLeft: 32
	},
	settingHeader: {
		margin: "0 0 16px",
		paddingBottom: 8,
		borderBottom: `1px solid ${colors.darkGray4}`
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	const { data, loading } = useGetWebhooksQuery({
		variables: {
			where: {
				stockPortfolioId: { equals: stockPortfolio.id }
			}
		}
	});

	const webhooks: Maybe<readonly Webhook[]> = data?.webhooks;

	if (loading || !webhooks) {
		return null;
	}

	return (
		<main className={classes.root}>
			<div className={classes.head}>
				<StockPortfolioHead stockPortfolio={stockPortfolio} />
			</div>
			<div className={classes.container}>
				<StockPortfolioSettings stockPortfolio={stockPortfolio} />
				<div className={classes.content}>
					<h2 className={classes.settingHeader}>Webhooks</h2>
					<div>
						<Link
							href={`/stock-portfolios/${stockPortfolio.id}/settings/webhooks/new`}
							passHref={true}
						>
							<AnchorButton intent="primary" text="Add webhook" />
						</Link>
					</div>
					<WebhookList webhooks={webhooks} />
				</div>
			</div>
		</main>
	);
};

export default withStockPortfolioAuth()(Page);
