import * as either from 'fp-ts/lib/Either';
import * as t from 'io-ts';
import { JsonDecodeError } from './types';
export declare type Either<L, A> = either.Either<L, A>;
export declare type validateType = (<A, O>(type: t.Type<A, O>) => (value: {}) => Either<JsonDecodeError, A>);
export declare const validateType: validateType;
export declare type jsonDecodeString = (<A, O>(type: t.Type<A, O>) => (value: string) => Either<JsonDecodeError, A>);
export declare const jsonDecodeString: jsonDecodeString;
export declare const formatJsonDecodeError: (error: ({
    tag: "ValidationErrors";
} & {
    validationErrors: t.ValidationError[];
}) | ({
    tag: "ParsingError";
} & {
    input: string;
    errorMessage: string;
})) => string[];
export declare const reportJsonDecodeError: (result: either.Either<({
    tag: "ValidationErrors";
} & {
    validationErrors: t.ValidationError[];
}) | ({
    tag: "ParsingError";
} & {
    input: string;
    errorMessage: string;
}), {}>) => string[];
export * from './types';
