type SuccessResponse<T> = {
    success: true;
    data: T;
    code?: string;
};

type FailureResponse = {
    success: false;
    data: string;
    code?: string;
};

export const success = <T>(data: T, code?: string): SuccessResponse<T> => ({
    success: true,
    data,
    code,
});

export const failure = (message: string, code?: string): FailureResponse => ({
    success: false,
    data: message,
    code,
});