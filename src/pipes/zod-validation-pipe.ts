import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodObject } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodObject<any>) { }

    transform(value: any) {
        try {
            return this.schema.parse(value)
        } catch (error) {
            if (error instanceof ZodError) {
                throw new BadRequestException({ errors: fromZodError(error), message: 'Validation failed', statusCode: 400 })
                // n ta entrando aqui
            }

            throw new BadRequestException('Validation failed')

        }
        return value
    }
}