import { Pipe, PipeTransform } from '@angular/core';
import { DropdwonTransformService } from '../../shared/services/dropdown-transform.service';

@Pipe({
  name: 'packageSizeOptions'
})
export class PackageSizePipe implements PipeTransform {

  constructor(
    private dropdwonTransformService: DropdwonTransformService
  ) { }
  // transform(value: any, args?: any): any {
  //   return null;
  // }
  transform(PackageSizeOptions: any[], PackageTypeId: string): any[] {
    console.log(PackageSizeOptions);

     return this.dropdwonTransformService.transform(PackageSizeOptions.filter(p => p.PkgTypeId === PackageTypeId)
        , 'UnitValue', 'UnitValue', '-- Select --');
  }

}
