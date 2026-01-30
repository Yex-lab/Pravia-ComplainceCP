import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource, EntityTarget } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const entity = validationArguments.constraints[0] as EntityTarget<object>;
    const pathToProperty = validationArguments.constraints[1];
    const repo = this.dataSource.getRepository(entity);

    if (!value || !entity || !repo) {
      return true; // Allow if validation can't be performed
    }

    const propertyName = pathToProperty || validationArguments.property;
    const record = await repo.findOne({
      where: {
        [propertyName]: value,
      },
    });

    return !record; // Return true if record does NOT exist
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.value} already exists.`;
  }
}
