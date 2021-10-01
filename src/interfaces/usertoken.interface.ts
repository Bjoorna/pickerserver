interface IUserToken{
    userID: string,
    email: string,
    isAdmin: boolean,
    iat?: number,
    exp?: number
}

export default IUserToken;