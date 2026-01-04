type UserDto = {
    ID: string;
    Username: string;
    FullName: string;
    Role: 'GESTOR' | 'VENDEDOR';
    IsActive: boolean;
};

export default UserDto;
