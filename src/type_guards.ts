/**
 * Result type for handling success/error cases
 * 
 * @typeParam T - Type of success value
 * @typeParam E - Type of error value
 */
export type Result<T, E> = OkResult<T, E> | ErrResult<T, E>;

/**
 * Represents a successful Result containing a value
 * 
 * @typeParam T - Type of success value
 * @typeParam E - Type of error value (unused in Ok case)
 */
export class OkResult<T, E> {
    readonly tag: 'ok' = 'ok';
    constructor(readonly data: T) {}

    isOk(): this is OkResult<T, E> {
        return true;
    }

    isErr(): this is ErrResult<T, E> {
        return false;
    }

    // Utility methods
    map<U>(fn: (value: T) => U): Result<U, E> {
        return Ok(fn(this.data));
    }

    unwrap(): T {
        return this.data;
    }

    unwrapOr(_default: T): T {
        return this.data;
    }
}

/**
 * Represents a failed Result containing an error
 * 
 * @typeParam T - Type of success value (unused in Err case)
 * @typeParam E - Type of error value
 */
export class ErrResult<T, E> {
    readonly tag: 'err' = 'err';
    constructor(readonly data: E) {}

    isOk(): this is OkResult<T, E> {
        return false;
    }

    isErr(): this is ErrResult<T, E> {
        return true;
    }

    // Utility methods
    map<U>(_fn: (value: T) => U): Result<U, E> {
        return Err(this.data);
    }

    unwrap(): never {
        throw new Error(`Attempted to unwrap an Err value: ${JSON.stringify(this.data)}`);
    }

    unwrapOr(defaultValue: T): T {
        return defaultValue;
    }
}

// Helper functions for Result
/**
 * Creates a successful Result
 * 
 * @param value - Value to wrap in Ok
 * @returns Result containing success value
 */
export function Ok<T, E>(value: T): Result<T, E> {
    return new OkResult(value);
}

/**
 * Creates a failed Result
 * 
 * @param error - Error to wrap in Err
 * @returns Result containing error value
 */
export function Err<T, E>(error: E): Result<T, E> {
    return new ErrResult(error);
}

// Type guards for Result
/**
 * Type guard for checking if Result is Ok
 * 
 * @param result - Result to check
 * @returns True if Result is Ok, false otherwise
 */
export function isOk<T, E>(result: Result<T, E>): result is OkResult<T, E> {
    return result.isOk();
}

/**
 * Type guard for checking if Result is Err
 * 
 * @param result - Result to check
 * @returns True if Result is Err, false otherwise
 */
export function isErr<T, E>(result: Result<T, E>): result is ErrResult<T, E> {
    return result.isErr();
}

/**
 * Option type for handling optional values
 * 
 * @typeParam T - Type of contained value
 */
export type Option<T> = SomeOption<T> | NoneOption<T>;

/**
 * Represents an Option containing a value
 * 
 * @typeParam T - Type of contained value
 */
export class SomeOption<T> {
    readonly tag: 'some' = 'some';
    constructor(readonly value: T) {}

    isSome(): this is SomeOption<T> {
        return true;
    }

    isNone(): this is NoneOption<T> {
        return false;
    }

    // Utility methods
    map<U>(fn: (value: T) => U): Option<U> {
        return Some(fn(this.value));
    }

    unwrap(): T {
        return this.value;
    }

    unwrapOr(_default: T): T {
        return this.value;
    }
}

/**
 * Represents an empty Option
 * 
 * @typeParam T - Type of value (unused in None case)
 */
export class NoneOption<T> {
    readonly tag: 'none' = 'none';

    isSome(): this is SomeOption<T> {
        return false;
    }

    isNone(): this is NoneOption<T> {
        return true;
    }

    // Utility methods
    map<U>(_fn: (value: T) => U): Option<U> {
        return None();
    }

    unwrap(): never {
        throw new Error('Attempted to unwrap a None value');
    }

    unwrapOr(defaultValue: T): T {
        return defaultValue;
    }
}

// Helper functions for Option
/**
 * Creates an Option containing a value
 * 
 * @param value - Value to wrap in Some
 * @returns Option containing value
 */
export function Some<T>(value: T): Option<T> {
    return new SomeOption(value);
}

/**
 * Creates an empty Option
 * 
 * @returns Empty Option
 */
export function None<T>(): Option<T> {
    return new NoneOption();
}

// Type guards for Option
/**
 * Type guard for checking if Option contains value
 * 
 * @param option - Option to check
 * @returns True if Option is Some, false otherwise
 */
export function isSome<T>(option: Option<T>): option is SomeOption<T> {
    return option.isSome();
}

/**
 * Type guard for checking if Option is empty
 * 
 * @param option - Option to check
 * @returns True if Option is None, false otherwise
 */
export function isNone<T>(option: Option<T>): option is NoneOption<T> {
    return option.isNone();
}