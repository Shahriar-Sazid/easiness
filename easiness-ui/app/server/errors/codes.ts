export type Err = {
    code: string;
    message?: string;
}
export const ReasonCode = {
    EntityNotFound: {
        code: "10001",
        message: "Entity not found with this id"
    },
    DupAccountNoFound: {
        code: "10002",
    },
    DupAccountNameFound: {
        code: "10003",
    },
    DupPeopleFound: {
        code: "10004",
    }
}