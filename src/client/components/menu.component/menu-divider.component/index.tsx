import { MenuDivider as BpDivider } from "@blueprintjs/core";
import React, { FC } from "react";

export interface IMenuDividerProps {
	className?: string;
}

export const MenuDivider: FC<IMenuDividerProps> = ({ className }) => {
	return <BpDivider className={className} />;
};
