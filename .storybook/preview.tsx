import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import { addDecorator, addParameters, configure } from "@storybook/react";
import { themes } from "@storybook/theming";
import { withRootProvider } from "../src/client/storybook";
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const alphabeticSort = (a, b) => {
	const isSameKind: boolean = a[1].kind === b[1].kind;

	if (isSameKind) {
		return 0;
	}

	const compared: boolean = a[1].id.localeCompare(b[1].id, undefined, { numeric: true });

	return compared;
};

addParameters({
	options: {
		showRoots: true,
		storySort: alphabeticSort,
		theme: themes.dark
	},
	viewport: {
		viewports: {
			...INITIAL_VIEWPORTS
		}
	}
});

addDecorator(withRootProvider);

configure(require.context("../src", true, /\.?stories(\/index)?\.mdx$/), module);
