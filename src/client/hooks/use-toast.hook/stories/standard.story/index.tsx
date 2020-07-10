import { Button } from "@/client/components";
import { useToast } from "@/client/hooks/use-toast.hook";
import React, { FC, useCallback, useState } from "react";

export const StandardStory: FC = () => {
	const [count, setCount] = useState<number>(1);

	const toaster = useToast();

	const createToast = useCallback(() => {
		toaster.show({ message: `New toast created! Counter: ${count}` });

		setCount(count + 1);
	}, [count, setCount, toaster]);

	return (
		<div>
			<Button intent="primary" onClick={createToast} text="Create toast" />
		</div>
	);
};
