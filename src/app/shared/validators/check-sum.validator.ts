import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

type ValidatorFn = (c: AbstractControl) => ValidationErrors | null;

export class CheckSumValidator {
    static validateSum(value: any, val1: any, val2: any, val3: any, val4: any): ValidatorFn {
        return (group: FormGroup): { [key: string]: boolean } | null => {

           const startweight = group.controls[value];
           const budweight = group.controls[val1];
           const jointsweight = group.controls[val2];
           const oilweight = group.controls[val3];
           const wasteweight = group.controls[val4];

            if (
                (startweight.value != null ) &&
                (budweight.value != null ) &&
                (jointsweight.value != null ) &&
                (oilweight.value != null ) &&
                (wasteweight.value != null )
            ) {
                if ((Number(budweight.value) + Number(jointsweight.value) + Number(oilweight.value) + Number(wasteweight.value)) !== startweight.value ) {
                    return startweight.value.setErrors({ 'validateSum': true});
                }
            }

            return null;
        };
    }
}
