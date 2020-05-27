import { identity, isNil } from "lodash";
import { raw } from "sql-template-tag";

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;

type ValuesKey = number | string;
type ValuesValue = Maybe<number | string>;

export class PgUtils {
	public static values = <
		TValues extends Map<ValuesKey, any> | Record<ValuesKey, any> | any[],
		TTransform extends ValuesValue,
		TValue extends TValues extends Map<ValuesKey, infer U>
			? U
			: TValues extends Record<ValuesKey, infer U>
			? U
			: TValues extends (infer U)[]
			? U
			: never
	>(
		values: TValues,
		transform: (value: TValue) => TTransform = identity
	) => {
		if (Array.isArray(values)) {
			return raw(`
				VALUES ${values
					.map(transform)
					.map((item) => `(${isNil(item) ? "NULL" : item})`)
					.join(", ")}
			`);
		}

		if (values instanceof Map) {
			return raw(`
				VALUES ${Array.from(values.entries())
					.map(([key, value]) => {
						const transformed = transform(value);

						return `(${key}, ${isNil(transformed) ? "NULL" : transformed})`;
					})
					.join(", ")}
			`);
		}

		return raw(`
			VALUES ${Object.entries(values)
				.map(([key, value]) => {
					const transformed = transform(value);

					return `(${key}, ${isNil(transformed) ? "NULL" : transformed})`;
				})
				.join(", ")}
		`);
	};

	public static MAX_INT = MAX_INT;
	public static MIN_INT = MIN_INT;
}
