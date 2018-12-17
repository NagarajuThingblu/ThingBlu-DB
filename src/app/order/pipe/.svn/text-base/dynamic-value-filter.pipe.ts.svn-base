import { Pipe, PipeTransform } from '@angular/core';
import { DropdwonTransformService } from '../../shared/services/dropdown-transform.service';
import * as _ from 'lodash';

@Pipe({
  name: 'dynamicValueFilter'
})
export class DynamicValueFilterPipe implements PipeTransform {

  constructor(
    private dropdwonTransformService: DropdwonTransformService
  ) { }

  transform(Data: any[], Flag: any, BrandId: any, SubBrandId: any, StrainId: any, PkgTypeId: any, UnitValue: any): any[] {
    if (Flag === 'SubBrand') {

      let filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.SubBrandId !== 0)
      , 'SubBrandName', 'SubBrandId', '-- Select --');

      filtered = _.uniqWith(filtered, _.isEqual);

      return filtered;
    } else if (Flag === 'Strain') {
      let filtered ;

      if (SubBrandId !== null && SubBrandId !== 0) {
         filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.SubBrandId === SubBrandId)
        , 'StrainName', 'StrainId', '-- Select --');
      } else {
        filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.SubBrandId === 0)
        , 'StrainName', 'StrainId', '-- Select --');
      }
      filtered = _.uniqWith(filtered, _.isEqual);

      return filtered;
    } else if (Flag === 'PackageType') {
      let filtered;

      if (SubBrandId !== null && SubBrandId !== 0) {
           filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.SubBrandId === SubBrandId
                    && p.StrainId === StrainId)
                , 'PkgTypeName', 'PkgTypeId', '-- Select --');
      } else {
        filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.StrainId === StrainId && p.SubBrandId === 0)
      , 'PkgTypeName', 'PkgTypeId', '-- Select --');
      }

      // filtered = _.mapValues(filtered, (v, k) => {
      //   return { label: _.capitalize(v.label), value: v.value };
      // });

      filtered = _.uniqWith(filtered, _.isEqual);

      return filtered;
    } else if (Flag === 'PackageSize') {
      let filtered;

      if (SubBrandId !== null && SubBrandId !== 0) {
        filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.SubBrandId === SubBrandId
          && p.StrainId === StrainId && p.PkgTypeId === PkgTypeId)
            , 'UnitValue', 'UnitValue', '-- Select --', false);
       } else {
        filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId
          && p.StrainId === StrainId && p.PkgTypeId === PkgTypeId && p.SubBrandId === 0)
            , 'UnitValue', 'UnitValue', '-- Select --', false);
       }

      filtered = _.uniqWith(filtered, _.isEqual);

      return filtered;
    //   .sort((a, b) => {
    //     if (a.label === '-- Select --' || a.label === '-- Select --') {
    //       return -1;
    //     }
    //     if (!a.label) {
    //       // Change this values if you want to put `null` values at the end of the array
    //       return -1;
    //    }
    //    if (!b.label) {
    //       // Change this values if you want to put `null` values at the end of the array
    //       return +1;
    //    }
    //    if (a.label < b.label) {
    //     return -1;
    //   } else if (a.label > b.label) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
    } else if (Flag === 'ItemQty') {
      let filtered;

      if (SubBrandId !== null && SubBrandId !== 0) {
        filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.SubBrandId === SubBrandId
          && p.StrainId === StrainId && p.PkgTypeId === PkgTypeId && p.UnitValue === UnitValue)
            , 'ItemQty', 'ItemQty', '-- Select --');
       } else {
        filtered =  this.dropdwonTransformService.transform(Data.filter(p => p.BrandId === BrandId && p.StrainId === StrainId
          && p.PkgTypeId === PkgTypeId && p.UnitValue === UnitValue && p.SubBrandId === 0)
            , 'ItemQty', 'ItemQty', '-- Select --');
       }

      filtered = _.uniqWith(filtered, _.isEqual);

      return filtered;
    }

  }

}
