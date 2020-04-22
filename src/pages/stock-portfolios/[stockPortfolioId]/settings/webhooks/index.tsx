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
		maxWidth: 980,
		margin: "0 auto",

		[breakpoints.up("sm")]: {
			display: "flex",
			alignItems: "flex-start",
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
	},
	createNewWrapper: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: 60,
		borderBottom: `1px solid ${colors.darkGray4}`,
		backgroundColor: theme.surface
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ stockPortfolio }) => {
	const classes = useStyles();

	const { data, loading, refetch } = useGetWebhooksQuery({
		variables: {
			where: {
				stockPortfolioId: { equals: stockPortfolio.id }
			}
		}
	});

	const webhooks: Maybe<readonly Webhook[]> = data?.webhooks;

	return (
		<main className={classes.root}>
			<div className={classes.head}>
				<StockPortfolioHead selectedTab="settings" stockPortfolio={stockPortfolio} />
			</div>
			<div className={classes.container}>
				<StockPortfolioSettings stockPortfolio={stockPortfolio} />
				<div className={classes.content}>
					<h2 className={classes.settingHeader}>Webhooks</h2>
					<div className={classes.createNewWrapper}>
						<Link
							href={`/stock-portfolios/${stockPortfolio.id}/settings/webhooks/new`}
							passHref={true}
						>
							<AnchorButton intent="primary" text="Add webhook" />
						</Link>
					</div>
					<WebhookList loading={loading} refetch={refetch} webhooks={webhooks} />
				</div>
			</div>
		</main>
	);
};

export default withStockPortfolioAuth()(Page);
