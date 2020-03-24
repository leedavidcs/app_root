const zIndices = [
	"data-grid-content",
	"data-grid-selected-cell",
	"data-grid-frozen-cell",
	"data-grid-header",
	"data-grid-frozen-header",
	"text-input-label",
	"kebab-menu",
	"context-menu",
	"app-bar",
	"backdrop"
] as const;

export const getZIndex = (name: typeof zIndices[number]): number => {
	const index: number = zIndices.findIndex((componentName) => componentName === name);

	if (index === -1) {
		throw new Error(`${name} is not a valid name for deriving z-index`);
	}

	return index;
};
