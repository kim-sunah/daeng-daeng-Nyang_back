import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        //검증 validate는 무조건 실행된다
        validate(value: any, args: ValidationArguments) {
          //검증에 성공했을떄
          const [relatedPropertyName] = args.constraints; //args.constraints  == ["password"]
          const relatedValue = (args.object as any)[relatedPropertyName];

          return value === relatedValue;
        },

        defaultMessage(args: ValidationArguments) {
          //검증에 실패했을떄
          console.log(args);
          const [relatedPropertyName] = args.constraints;
          return `Confirm Password does not match Password"`;
        },
      },
    });
  };
}
