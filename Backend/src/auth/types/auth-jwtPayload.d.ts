export type AuthJwtPayload = {
    email: string;
    sub: number;
    permissions: UserRole;
};
