import { Context, createContext } from "react";
import { DraggableData, DraggableEvent } from "react-draggable";

interface IResizeContextProps {
	onResize: (event: DraggableEvent, data: DraggableData, i: number) => void;
	isResizing: boolean;
	onResizeEnd: (event: DraggableEvent) => void;
	resizeHandleClassName: string;
}

export const ResizeContext: Context<IResizeContextProps> = createContext<IResizeContextProps>({
	isResizing: false,
	onResize: () => undefined,
	onResizeEnd: () => undefined,
	resizeHandleClassName: ""
});

ResizeContext.displayName = "ResizeContext";
