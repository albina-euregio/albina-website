import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors } from '@angular/forms';

/** Passwords must match */
export const passwordMismatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const password2 = control.get('password2');
  return password && password2 && password.value === password2.value ? null : { passwordMismatch: true };
};

@Directive({
  selector: '[appPasswordMismatch]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: PasswordMismatchValidatorDirective,
    multi: true
  }]
})
export class PasswordMismatchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return passwordMismatchValidator(control);
  }
}
