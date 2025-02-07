export interface KeyValue {
    key: string;
    value: string;
}

export interface CallArgs {
    url: string;
    header?: any;
    body?: any; // Using `any` for JsonNode equivalent (adjust as needed)
    query?:any;
}

export enum CallType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export interface Call {
    description?: string;
    call: CallType | null;
    args: CallArgs;
    result?: any;  // Equivalent to JsonNode (any JSON object)
    retry?: Retry;
}

export interface BackOff {
    initialIntervalSeconds?: number;  // Optional because Java defaulted it to "null"
    backoffCoefficient?: number;
    maxIntervalSeconds?: number;
}

export interface Retry {
    maxAttempts?: number;  // Optional because Java defaulted it to "null"
    backoff?: BackOff;
}
