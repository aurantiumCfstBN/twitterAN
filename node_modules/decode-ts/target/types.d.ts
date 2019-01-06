import * as t from 'io-ts';
export declare const JsonDecodeError: {
    _Tags: "ValidationErrors" | "ParsingError";
    _Record: {
        ValidationErrors: {
            validationErrors: t.ValidationError[];
        };
        ParsingError: {
            input: string;
            errorMessage: string;
        };
    };
    _Union: ({
        tag: "ValidationErrors";
    } & {
        validationErrors: t.ValidationError[];
    }) | ({
        tag: "ParsingError";
    } & {
        input: string;
        errorMessage: string;
    });
    is: {
        ValidationErrors: (variant: ({
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        }) | ({
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        })) => variant is {
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        };
        ParsingError: (variant: ({
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        }) | ({
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        })) => variant is {
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        };
    };
    as: {
        ValidationErrors: (variant: ({
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        }) | ({
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        })) => {
            validationErrors: t.ValidationError[];
        };
        ParsingError: (variant: ({
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        }) | ({
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        })) => {
            input: string;
            errorMessage: string;
        };
    };
    match: {
        <A>(cases: {
            ValidationErrors: (value: {
                validationErrors: t.ValidationError[];
            }) => A;
            ParsingError: (value: {
                input: string;
                errorMessage: string;
            }) => A;
        }): (variant: ({
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        }) | ({
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        })) => A;
        <K extends "ValidationErrors" | "ParsingError", A>(cases: { [T in K]: (value: {
            ValidationErrors: {
                validationErrors: t.ValidationError[];
            };
            ParsingError: {
                input: string;
                errorMessage: string;
            };
        }[T]) => A; }, fallback: (tag: "ValidationErrors" | "ParsingError") => A): (variant: ({
            tag: "ValidationErrors";
        } & {
            validationErrors: t.ValidationError[];
        }) | ({
            tag: "ParsingError";
        } & {
            input: string;
            errorMessage: string;
        })) => A;
    };
} & {
    ValidationErrors: (value: {
        validationErrors: t.ValidationError[];
    }) => ({
        tag: "ValidationErrors";
    } & {
        validationErrors: t.ValidationError[];
    }) | ({
        tag: "ParsingError";
    } & {
        input: string;
        errorMessage: string;
    });
    ParsingError: (value: {
        input: string;
        errorMessage: string;
    }) => ({
        tag: "ValidationErrors";
    } & {
        validationErrors: t.ValidationError[];
    }) | ({
        tag: "ParsingError";
    } & {
        input: string;
        errorMessage: string;
    });
};
export declare type JsonDecodeError = typeof JsonDecodeError._Union;
