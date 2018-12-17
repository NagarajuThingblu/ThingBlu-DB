import { Injectable, ErrorHandler } from '@angular/core';
import { ErrorLogService } from '../services/ErrorLog.service' ;

// Global error handler for logging errors
@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
    constructor(private errorLogService: ErrorLogService) {
       // Angular provides a hook for centralized exception handling.
       // constructor ErrorHandler(): ErrorHandler
        super();
    }

    handleError(error): void {
        this.errorLogService.logError(error);
    }
}
