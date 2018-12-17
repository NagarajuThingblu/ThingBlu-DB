import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

type ValidatorFn = (c: AbstractControl) => ValidationErrors | null;

export class PositiveIntegerValidator {
    static allowOnlyPositiveInteger(control: AbstractControl): ValidationErrors | null {

        if (Number(control.value) < 0 ) {
            return { allowOnlyPositiveInteger: true };
        }

        return null;
    }
}
