export enum RepositoryResponse {
    NOT_FOUND,
    FAILED,
    SUCCESS,
}

export enum ResponseMessage {
    INVALID_PARAMETERS = "Invalid Parameters",
    SERVER_ERROR = "Internal Server Error",
}

export enum HttpStatus {
    INVALID_ID = 404,
    ID_NOT_FOUND = 404,
    BAD_DATA_FORMATTING = 400,
    SERVER_ERROR = 500,
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
}
