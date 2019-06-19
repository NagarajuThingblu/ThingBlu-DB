export class UserModel {
    UserRole: string;
    VirtualRoleId: number;
    UserName: string;
    EmpName: string;
    EmpId: string;
    EmailId: string;
    Loggedin: string;
    ClientId: number;
    LotTresholdValue: number;
    AutoLogoutValue: number;
    IdleLogoutValue: number;
    UTCTime: number;
    // Added by DEVDAN :: Added variables to get the value from server side
    EncryptDecryptKey: string;
    RefreshInterval: string;
    IsFirstTimeSignIn: any;
  }
