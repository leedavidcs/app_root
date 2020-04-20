import { IHeaderOption } from "@/client/components";
import { useGetDataKeyOptionsQuery } from "@/client/graphql";
import { useMemo } from "react";

interface IUseOptionsResult {
	loaded: boolean;
	options: readonly IHeaderOption[];
}

export const useOptions = (): IUseOptionsResult => {
	const { called, data, loading } = useGetDataKeyOptionsQuery();

	const options: readonly IHeaderOption[] = useMemo(() => {
		return (data?.dataKeyOptions || []).map(({ name, dataKey }) => ({
			label: name,
			value: dataKey
		}));
	}, [data]);

	const loaded: boolean = called && !loading;

	return useMemo(() => ({ loaded, options }), [loaded, options]);
};
