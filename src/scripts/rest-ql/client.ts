import { map } from "blend-promise-utils";
import { isEmpty, isNil } from "lodash";
import type { IAstRoot } from ".";

interface IRestQLClientConfig<TContext extends object = any> {
	ast: MaybePromise<IAstRoot>;
	context: TContext;
}

interface IPropParams {
	props?: { [key: string]: FieldProp };
}

type FieldProp = true | IPropParams;

interface IFieldParams extends IPropParams {
	args?: { [key: string]: any };
}

type ProviderField = true | IFieldParams;

interface IQueryParams<TRequestArgs extends object = any, TGroupByArgs extends object = any> {
	groupByArgs?: TGroupByArgs;
	requestArgs?: TRequestArgs;
	provider: string;
	fields: { [name: string]: ProviderField };
}

export class RestQLClient<TContext extends object = any, TRequestArgs extends object = any> {
	private ast: MaybePromise<IAstRoot>;
	private context: MaybePromise<TContext>;

	constructor(config: IRestQLClientConfig) {
		this.ast = config.ast;
		this.context = config.context;
	}

	public query = async (params: IQueryParams<TRequestArgs>) => {
		const { requestArgs = {}, groupByArgs = {}, provider, fields } = params;

		const ast = await this.ast;
		const context = await this.context;

		const providerInfo = ast.query.__providers[provider];

		if (!providerInfo) {
			return null;
		}

		const fieldInfos = providerInfo.__fields;

		const maybeResults = await map(Object.entries(fields), async ([fieldName, field]) => {
			const fieldResolver = fieldInfos[fieldName]?.__fn;

			if (!fieldResolver) {
				return [fieldName, undefined] as [string, undefined];
			}

			const isDataRequested: boolean =
				field === true || isNil(field.props) || !isEmpty(field.props);

			if (!isDataRequested) {
				return [fieldName, undefined] as [string, undefined];
			}

			const args = field === true || field.args === undefined ? {} : field.args;

			let result: any;
			try {
				result = await fieldResolver({
					context,
					requestArgs,
					groupByArgs,
					args,
					isMock: false
				});
			} catch {
				result = [fieldName, undefined] as [string, undefined];
			}

			const withPropsLimit =
				field === true ? result : this.limitToFields(result, field.props);

			return [fieldName, withPropsLimit] as [string, any];
		});

		const finalResult = maybeResults.reduce((acc, [fieldName, fieldResult]) => {
			return isNil(fieldResult) ? acc : { ...acc, [fieldName]: fieldResult };
		}, {} as Record<string, any>);

		return finalResult;
	};

	private limitToFields = (
		values: any,
		fieldParams: Maybe<{ [name: string]: FieldProp }>
	): any => {
		if (!fieldParams) {
			return values;
		}

		const withSelectionsArray = Object.entries<FieldProp>(fieldParams).map(
			([fieldName, field]) => {
				const value = values[fieldName];

				if (field === true) {
					return value;
				}

				if (!field.props || isEmpty(field.props)) {
					return [fieldName, undefined] as [string, undefined];
				}

				return [fieldName, this.limitToFields(value, field.props)] as [string, any];
			}
		);

		const withSelectionsDict = withSelectionsArray.reduce(
			(acc, [fieldName, field]) => (isNil(fieldName) ? acc : { ...acc, [fieldName]: field }),
			{} as Record<string, any>
		);

		return withSelectionsDict;
	};
}
