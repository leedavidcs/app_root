import { exec } from "child_process";
import DotEnv from "dotenv";

DotEnv.config();

/* tslint:disable:no-console */

const outputSchemaDir = "src/client/graphql/schema.json";
const outputCodegenDir = "src/client/graphql/types/generated/typings-graphql-inputs.ts";

const buildStrOptions = (options: Record<string, string>): string => {
	return Object.keys(options)
		.map((option) => `--${option}=${options[option]}`)
		.join(" ");
};

const buildBoolOptions = (options: readonly string[]): string => {
	return options.map((option) => `--${option}`).join(" ");
};

const buildDownloadSchemaOptions = () => `${buildStrOptions({
	endpoint: `${process.env.REACT_APP_API_BASE_URL}/api/graphql`
})}`

const buildCodegenOptions = () => `${buildStrOptions({
	endpoint: `${process.env.REACT_APP_API_BASE_URL}/api/graphql`,
	includes: "src/client/graphql/**/*.ts",
	localSchemaFile: outputSchemaDir,
	tagName: "gql",
	target: "typescript"
})} ${buildBoolOptions(["addTypename", "outputFlat", "useReadOnlyTypes"])}`;

const downloadSchema = (): Promise<string> => new Promise<string>((resolve, reject) => {
	exec(
		`apollo client:download-schema ${buildDownloadSchemaOptions()} ${outputSchemaDir}`,
		(err, stdout, stderr) => {
			if (err || stderr) {
				return reject(`stderr: ${err?.message || stderr}`);
			}

			return resolve(`stdout: ${stdout}`);
		}
	);
});

const codegen = (): Promise<string> => new Promise<string>((resolve, reject) => {
	exec(`apollo client:codegen ${buildCodegenOptions()} ${outputCodegenDir}`, (err, stdout, stderr) => {
		(err, stdout, stderr) => {
			if (err || stderr) {
				return reject(`stderr: ${err?.message || stderr}`);
			}

			return resolve(`stdout: ${stdout}`);
		}
	});
});

const main = async (): Promise<never> => {
	try {
		console.log(await downloadSchema());
		console.log(await codegen());

		process.exit(0);
	} catch (err) {
		console.error(err);

		process.exit(1);
	}
};

main();
