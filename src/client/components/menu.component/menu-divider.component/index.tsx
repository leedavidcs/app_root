import { MenuDivider as BpMenuDivider } from "@blueprintjs/core";
import React, { FC } from "react";

export interface IMenuDividerProps {
	className?: string;
}

export const MenuDivider: FC<IMenuDividerProps> = ({ className }) => {
	return <BpMenuDivider className={className} />;
};
