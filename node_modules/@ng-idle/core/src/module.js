import { NgModule } from '@angular/core';
import { Idle } from './idle';
import { IdleExpiry } from './idleexpiry';
import { LocalStorageExpiry } from './localstorageexpiry';
import { LocalStorage } from './localstorage';
var NgIdleModule = (function () {
    function NgIdleModule() {
    }
    NgIdleModule.forRoot = function () {
        return {
            ngModule: NgIdleModule,
            providers: [LocalStorageExpiry, { provide: IdleExpiry, useExisting: LocalStorageExpiry }, Idle]
        };
    };
    NgIdleModule.decorators = [
        { type: NgModule, args: [{
                    providers: [LocalStorage]
                },] },
    ];
    /** @nocollapse */
    NgIdleModule.ctorParameters = function () { return []; };
    return NgIdleModule;
}());
export { NgIdleModule };
//# sourceMappingURL=module.js.map