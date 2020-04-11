import { DocumentNode } from "apollo-boost";
import DirectivesSchema from "./directives.schema";
import ModalSchema from "./modal.schema";
import ToastSchema from "./toast.schema";
import UserSchema from "./user.schema";

export const typeDefs: DocumentNode[] = [DirectivesSchema, ModalSchema, ToastSchema, UserSchema];
