import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

import { User } from "src/entity/User";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistsConstraint implements ValidatorConstraintInterface {
    async validate(email: string) {
        return User.findOne({ where: { email } }).then(user => {
            if(user) return false;
            return true;
        });
    }
}

export const IsEmailAlreadyExists = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailAlreadyExistsConstraint
        });
    };
}