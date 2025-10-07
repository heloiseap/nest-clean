import {
  UsePipes,
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'
import { Public } from '@/infra/auth/public'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body // createAccountBodySchema.parse(body) ->zod esta validando com pipe
    // // const name = 'John Doe'
    // // const email = 'johndoe@example.com'
    // // const password = '123456'
    
    // const userWithSameEmail = await this.prisma.user.findUnique({
      //   where: {
        //     email,
        //   },
        // })
        
        // if (userWithSameEmail) {
          //   console.log('email repetido')
          //   throw new ConflictException(
    //     'User with same e-mail address already exists',
    //   )
    // }

    // const hashedPassword = await hash(password, 8) // 8 - nº de rounds
    // console.log(hashedPassword)

    // await this.prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //   },
    // })
    const result = await this.registerStudent.execute({
      name,
      email,
      password
    })

    console.log(await result)

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
      // throw new Error()
    }
  }
}
