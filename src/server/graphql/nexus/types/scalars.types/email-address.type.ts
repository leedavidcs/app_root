import { EmailAddressResolver } from "graphql-scalars";
import { scalarType } from "nexus";

export const EmailAddress = scalarType({
	name: "EmailAddress",
	description: EmailAddressResolver.description,
	serialize: EmailAddressResolver.serialize,
	parseValue: EmailAddressResolver.parseValue,
	parseLiteral: EmailAddressResolver.parseLiteral
});
