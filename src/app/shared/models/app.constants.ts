export class AppConstants {
    public static get baseURL(): string { return 'http://localhost:4200/api'; }
    public static get httpError(): string { return 'There was an HTTP error.'; }
    public static get typeError(): string { return 'There was a Type error.'; }
    public static get generalError(): string { return 'There was a general error.'; }
    public static get somethingHappened(): string { return 'Nobody threw an Error but something happened!'; }
    public static get decimalPlaces(): number { return 2; }
    public static get maxLength(): number { return 13; }
    public static get getStatusList(): any {
        return {
            Assigned: 'ASSIGNED',
            InProcess: 'INPROCESS',
            Paused: 'PAUSED',
            ReviewPending: 'REVIEW PENDING',
            Completed: 'COMPLETED'
        } ;
    }
    public static get getUserRoles(): any {
        return {
            Manager: 'Manager',
            Employee: 'Employee',
            SuperAdmin: 'SuperAdmin'
        } ;
    }
    public static get defaultTextAreaLength(): number {
        return 500;
    }
    public static get getPaginationOptions(): any {
        return [5, 10, 15, 20];
    }
    public static get defaultPageRows(): any {
        return 10;
    }
}
