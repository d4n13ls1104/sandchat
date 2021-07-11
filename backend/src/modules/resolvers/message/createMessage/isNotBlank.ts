import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsNotBlankConstraint implements ValidatorConstraintInterface {
    async validate(input: string) {
        return input.trim().length !== 0; 
    }
}


export const IsNotBlank = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsNotBlankConstraint
        });
    }
}