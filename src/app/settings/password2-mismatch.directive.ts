import { Directive } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, ValidationErrors } from "@angular/forms";

/** Passwords must match */
export const password2MismatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get("password");
  const password2 = control.get("password2");
  return password && password2 && password.value === password2.value ? null : { passwordMismatch: true };
};

@Directive({
  selector: "[appPassword2Mismatch]",
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: Password2MismatchValidatorDirective,
    multi: true
  }]
})
export class Password2MismatchValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors {
    return password2MismatchValidator(control);
  }
}
