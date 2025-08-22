import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
    
    constructor(private prisma: PrismaService){}

    @Post()
    @UsePipes(new ZodValidationPipe(createAccountBodySchema) )
    @HttpCode(201)
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password } = body // createAccountBodySchema.parse(body) ->zod esta validando com pipe

        // const name = 'John Doe'
        // const email = 'johndoe@example.com'
        // const password = '123456'   

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            }
        })

        if (userWithSameEmail) {
            console.log('email repetido')
            throw new ConflictException('User with same e-mail address already exists')
        }

        const hashedPassword = await hash(password, 8) // 8 - nº de rounds
        console.log(hashedPassword)

        await this.prisma.user.create({
            data: {
                name, 
                email,
                password: hashedPassword
            }
        })
 
    }
    
}