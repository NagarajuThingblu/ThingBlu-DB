import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

type ValidatorFn = (c: AbstractControl) => ValidationErrors | null;

export class DateValidators {
    static dateCompares(dateField1: string, dateField2: string): ValidatorFn {
        return (group: FormGroup): { [key: string]: boolean } | null => {

            const date1 = group.controls[dateField1];
            const date2 = group.controls[dateField2];
            if ((date1.value !== null && date2.value !== null) && (date1.value !== '' && date2.value !== '')) {
                if (date1.value > date2.value) {
                    return { invalidDate: true };
                }
                // return dateField1.setErrors({ notEquivalent: true })
            }
            return null;
        };
    }

    static compareDates(startDate: string, endDate: string) {
        return (control: AbstractControl) => {
            const date1 = control.value;

            // let date2 = group.controls[endDate];

            date1.setErrors({ notEquivalent: true });
            // if (passwordInput.value !== passwordConfirmationInput.value) {
            //     return passwordConfirmationInput.setErrors({ notEquivalent: true })
            // }
        };
    }
}
