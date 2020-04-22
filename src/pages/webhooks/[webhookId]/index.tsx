import { Card, ResourcePath } from "@/client/components";
import { UpsertWebhookForm } from "@/client/forms";
import { GetWebhookQuery } from "@/client/graphql";
import { withWebhookAuth } from "@/client/hocs";
import { StockPortfolioHead, StockPortfolioSettings } from "@/client/page-parts";
import { breakpoints, colors, CustomTheme } from "@/client/themes";
import { NextPage } from "next";
import React from "react";
import { createUseStyles } from "react-jss";

type Webhook = NonNullable<GetWebhookQuery["webhook"]>;

interface IProps {
	webhook: Webhook;
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
	settingTitle: {
		fontSize: 14
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
		marginTop: 24,

		[breakpoints.up("sm")]: {
			marginTop: 0,
			marginLeft: 24
		}
	}
});

const useStyles = createUseStyles<CustomTheme, keyof ReturnType<typeof styles>>(styles);

const Page: NextPage<IProps> = ({ webhook }) => {
	const classes = useStyles();

	const stockPortfolio = webhook.stockPortfolio;

	return (
		<main className={classes.root}>
			<div className={classes.head}>
				<StockPortfolioHead selectedTab="settings" stockPortfolio={stockPortfolio} />
			</div>
			<div className={classes.container}>
				<StockPortfolioSettings stockPortfolio={stockPortfolio} />
				<Card
					className={classes.content}
					title={
						<ResourcePath className={classes.settingTitle}>
							<ResourcePath.Part
								href={`/stock-portfolios/${stockPortfolio.id}/settings/webhooks`}
								text="Webhooks"
							/>
							<ResourcePath.Part
								active={true}
								href={`/stock-portfolios/${stockPortfolio.id}/settings/webhooks/new`}
								text={webhook.name}
							/>
						</ResourcePath>
					}
				>
					<UpsertWebhookForm
						stockPortfolioId={stockPortfolio.id}
						webhookId={webhook.id}
					/>
				</Card>
			</div>
		</main>
	);
};

export default withWebhookAuth()(Page);
