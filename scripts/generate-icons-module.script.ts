import { Logger } from "@/server/utils";
import { IconSvgPaths16, IconSvgPaths20, IconName } from "@blueprintjs/icons";
import fs from "fs-extra";
import path from "path";

const config: readonly IconName[] = [
	"arrow-left",
	"arrow-right",
	"blank",
	"caret-down",
	"caret-right",
	"chevron-down",
	"chevron-left",
	"chevron-right",
	"chevron-up",
	"cog",
	"credit-card",
	"cross",
	"cube",
	"drag-handle-vertical",
	"edit",
	"error",
	"full-circle",
	"grid",
	"log-in",
	"log-out",
	"menu",
	"more",
	"plus",
	"refresh",
	"saved",
	"search",
	"small-cross",
	"small-tick",
	"tick",
	"trash",
	"user"
];

const REPLACE_ICONS_16 = "%%REPLACE_ICONS_16%%";
const REPLACE_ICONS_20 = "%%REPLACE_ICONS_20%%";

const contents =
`export const IconSvgPaths16 = ${REPLACE_ICONS_16};
export const IconSvgPaths20 = ${REPLACE_ICONS_20};
`;

const writePath: string = path.join(
	process.env.PROJECT_DIRNAME ?? "",
	"./generated/icons.generated.ts"
);

const main = async () => {
	const icons16 = config.reduce((acc, icon) => ({
		...acc,
		[icon]: IconSvgPaths16[icon]
	}), {} as Record<IconName, readonly string[]>);

	const icons20 = config.reduce((acc, icon) => ({
		...acc,
		[icon]: IconSvgPaths20[icon]
	}), {} as Record<IconName, readonly string[]>);

	const withIcons16 = contents.replace(REPLACE_ICONS_16, JSON.stringify(icons16, null, 2));
	const withIcons20 = withIcons16.replace(REPLACE_ICONS_20, JSON.stringify(icons20, null, 2));

	fs.ensureFileSync(writePath);
	fs.writeFileSync(writePath, withIcons20, {
		encoding: "utf8",
		flag: "w"
	});

	Logger.info("Icons have been generated.");
};

main().then(() => process.exit(0));
