type AuthToken = {
    UserId: string;
    Role: 'GESTOR' | 'VENDEDOR';
    iat: number;
    exp: number;
};

export default AuthToken;
