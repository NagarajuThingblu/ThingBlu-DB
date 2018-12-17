import { Type } from '@angular/core';

export class TaskKeysModel {

    public static get TaskKeys(): any {

        const map = new Map<any, Map<any, any>>();

        // const map1 = new Map();
        // map1.set('lotno', 'LotId'),
        // map1.set('brand', 'BrandName'),

        const map1 = new Map([
            [ 'lotno', 'LotId' ],
            [ 'brand', 'BrandName' ],
            // [ 'strain', 'StrainName' ],
            // Modified by Devdan :: 09-Oct-2018
            [ 'strain', 'StrainId' ],
            [ 'strainName', 'StrainName' ],
            // [ 'startdate', 'EstStartDate' ],
            [ 'priority', 'TaskPriority' ],
            [ 'usercomment', 'Comments' ],
            // [ 'notifymanager', 'IsManagerNotify' ],
            // [ 'notifyemployee', 'IsEmpNotify' ],
            [ 'employee', 'EmpId'],
            [ 'lotweight', 'BioTrackWeight']
        ]);

        const map2 = new Map([
            [ 'lotno', 'LotId' ],
            [ 'brand', 'BrandName' ],
            // Modified by Devdan :: 08-Oct-2018
            [ 'strain', 'StrainId' ],
            // [ 'startdate', 'EstStartDate' ],
            [ 'priority', 'TaskPriority' ],
            [ 'usercomment', 'Comments' ],
            // [ 'notifymanager', 'IsManagerNotify' ],
            // [ 'notifyemployee', 'IsEmpNotify' ],
            [ 'employee', 'EmpId'],
            [ 'lotweight', 'BioTrackWeight'],
            ['assignwt', 'AssignedWt']
        ]);
       map.set('TRIMMING', map1);
       map.set('SIFTING', map2);
       map.set('BUDPACKAGING', map1);
       map.set('GRINDING', map1);
       map.set('TAMPING', map1);
       map.set('JOINTSCREATION', map1);
       map.set('TUBING', map1);

        return map;
    }

}
