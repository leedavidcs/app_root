export class ArrayUtil {
	public static replace<T>(array: readonly T[], index: number, value: T): readonly T[] {
		const result: readonly T[] = Object.assign([], array, { [index]: value });

		return result;
	}
}
