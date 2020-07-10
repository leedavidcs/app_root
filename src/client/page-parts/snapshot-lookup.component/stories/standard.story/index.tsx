import { Snapshot as _Snapshot } from "@/client/graphql/generated";
import { SnapshotLookup } from "@/client/page-parts/snapshot-lookup.component";
import { action } from "@storybook/addon-actions";
import React, { FC, useCallback, useState } from "react";

type Snapshot = Pick<_Snapshot, "id" | "createdAt">;

export const StandardStory: FC = () => {
	const [snapshot, setSnapshot] = useState<Maybe<Snapshot>>();

	const onChange = useCallback((selected: Snapshot) => {
		action("onChange")(selected);
		setSnapshot(selected);
	}, []);

	return <SnapshotLookup onChange={onChange} selected={snapshot} stockPortfolioId="" />;
};
