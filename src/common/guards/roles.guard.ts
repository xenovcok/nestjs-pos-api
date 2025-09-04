import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(
        ctx: ExecutionContext
    ): boolean {
        const required =this.reflector.getAllAndOverride<Array<'admin' | 'user' | 'owner'>>(
            ROLES_KEY,
            [
                ctx.getHandler(),
                ctx.getClass(),
            ],
        );
        if (!required || required.length === 0) return true;
        const { user } = ctx.switchToHttp().getRequest();
        return required.includes(user.role);
    }
}