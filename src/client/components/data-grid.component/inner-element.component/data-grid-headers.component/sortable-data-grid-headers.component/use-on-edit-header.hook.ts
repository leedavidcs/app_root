import { HeadersContext } from "@/client/components/data-grid.component";
import { useKeyDown } from "@/client/hooks";
import { flow } from "lodash";
import {
	ChangeEventHandler,
	KeyboardEventHandler,
	useCallback,
	useContext,
	useMemo,
	useState
} from "react";

interface IUseOnEditHeaderStates {
	label: string;
	header: number;
	width: number;
}

interface IUseOnEditHeaderActions {
	onKeyDown: KeyboardEventHandler<HTMLInputElement>;
	onChange: ChangeEventHandler<HTMLInputElement>;
	onEdit: (index: number) => void;
	onStop: () => void;
}

type UseOnEditHeaderResult = [IUseOnEditHeaderStates, IUseOnEditHeaderActions];

export const useOnEditHeader = (): UseOnEditHeaderResult => {
	const { headers, setHeaderLabel } = useContext(HeadersContext);

	const [label, setLabel] = useState<string>("");
	const [header, setHeader] = useState<number>(-1);
	const [width, setWidth] = useState<number>(0);

	const stopEdit = useCallback(() => setHeader(-1), []);
	const updateLabel = useCallback(() => setHeaderLabel(label, header), [
		header,
		setHeaderLabel,
		label
	]);

	const onEscKey = useKeyDown("esc", stopEdit);
	const onEnterKey = useKeyDown(
		"enter",
		useCallback(flow(updateLabel, stopEdit), [stopEdit, updateLabel])
	);
	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
		flow(onEscKey, onEnterKey),
		[onEnterKey, onEscKey]
	);

	const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		({ target }) => setLabel(target.value),
		[]
	);

	const onEdit = useCallback(
		(index: number) => {
			const selected = headers[index];

			const currentLabel: string = selected.label;
			const currentWidth: number = selected.width;

			setHeader(index);
			setLabel(currentLabel);
			setWidth(currentWidth);
		},
		[headers]
	);

	const onStop = useCallback(() => {
		setHeader(-1);
		setLabel("");
		setWidth(0);
	}, []);

	const states: IUseOnEditHeaderStates = useMemo(() => ({ label, header, width }), [
		header,
		label,
		width
	]);
	const actions: IUseOnEditHeaderActions = useMemo(
		() => ({ onKeyDown, onChange, onEdit, onStop }),
		[onChange, onEdit, onKeyDown, onStop]
	);
	const result: UseOnEditHeaderResult = useMemo(() => [states, actions], [actions, states]);

	return result;
};
