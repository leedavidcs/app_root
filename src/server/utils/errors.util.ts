import { ApolloError } from "apollo-server-micro";

export class AuthorizationError extends ApolloError {
	constructor(message = "This operation is not authorized.") {
		super(message, "UNAUTHORIZED");
	}
}

export class BadInputError extends ApolloError {
	constructor(message = "This operation contains invalid arguments.") {
		super(message, "BAD_REQUEST");
	}
}

export class ComplexityError extends ApolloError {
	constructor(message = "This operation is exceeds max complexity constraints.") {
		super(message, "FORBIDDEN");
	}
}

export class NotFoundError extends ApolloError {
	constructor(message = "This entity could not be found.") {
		super(message, "NOT_FOUND");
	}
}

export class OperationUnavailableError extends ApolloError {
	constructor(message = "This operation is unavailable.") {
		super(message, "NOT_IMPLEMENTED");
	}
}

export class PaymentError extends ApolloError {
	constructor(message = "This operation requires payment.") {
		super(message, "PAYMENT_REQUIRED");
	}
}

export class RateLimitError extends ApolloError {
	constructor(message = "This operation was requested too many times.") {
		super(message, "TOO_MANY_REQUESTS");
	}
}

export class UnexpectedError extends ApolloError {
	constructor(message = "Unexpected Error. Should not reach here.") {
		super(message, "UNEXPECTED");
	}
}
