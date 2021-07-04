import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import { User } from "../../../entity/User";

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyRegisteredConstraint implements ValidatorConstraintInterface {
  async validate(username: string) {
    return User.findOne({ where: { username }}).then((user) => {
      if(user) return false;

      return true;
    });
  }
}

export const IsUsernameAlreadyRegistered = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyRegisteredConstraint
    });
  }
}