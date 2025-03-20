// Result type definition
export type Result<T, E> = OkResult<T, E> | ErrResult<T, E>;

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
export function Ok<T, E>(value: T): Result<T, E> {
    return new OkResult(value);
}

export function Err<T, E>(error: E): Result<T, E> {
    return new ErrResult(error);
}

// Type guards for Result
export function isOk<T, E>(result: Result<T, E>): result is OkResult<T, E> {
    return result.isOk();
}

export function isErr<T, E>(result: Result<T, E>): result is ErrResult<T, E> {
    return result.isErr();
}

// Option type definition
export type Option<T> = SomeOption<T> | NoneOption<T>;

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
export function Some<T>(value: T): Option<T> {
    return new SomeOption(value);
}

export function None<T>(): Option<T> {
    return new NoneOption();
}

// Type guards for Option
export function isSome<T>(option: Option<T>): option is SomeOption<T> {
    return option.isSome();
}

export function isNone<T>(option: Option<T>): option is NoneOption<T> {
    return option.isNone();
}