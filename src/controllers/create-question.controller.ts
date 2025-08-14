import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import type { Request } from 'express'
import { CurrentUser } from "src/auth/current-user.decorator";
import type { UserPayload } from "src/auth/jwt.strategy";

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
    
    constructor(){}

    @Post()
    async handle(@CurrentUser() user: UserPayload) {
        console.log(user)
        return 'ok'
    }
    
}