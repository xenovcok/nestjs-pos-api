import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Array<'admin' | 'user' | 'owner'>) => 
    SetMetadata(ROLES_KEY, roles);
