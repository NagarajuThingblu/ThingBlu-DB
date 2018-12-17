import { Component, OnInit, Input, Output, EventEmitter, Pipe, Directive } from '@angular/core';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppComponent } from '../../../app.component';
import { MastersResource } from '../../master.resource';
import { GlobalResources } from '../../../global resource/global.resource';
import { NewEmployeeService } from '../../services/new-employee.service';
import { ConfirmationService } from 'primeng/api';
import { AppCommonService } from '../../../shared/services/app-common.service';

@Component({
  selector: 'app-employee-listing',
  templateUrl: './employee-listing.component.html',
  styleUrls: ['./employee-listing.component.css']
})
export class EmployeeListingComponent implements OnInit {
  public event: any;
  userType: any;
  public newemployee: any = {
    IsActive: true
  };
  public newEmployeeResources: any;
  public _cookieService: any;
  public globalResource: any;
  // Commented by Devdan :: 21-Nov-2018 :: Unused
  // public LotInfo: any = {
  //   LotId: 0,
  //   showLotNoteModal: false
  // };
  @Input() PaginationValues: any;
  @Input() allEmployeeList: any;
  @Output() EmployeeEditEvent = new EventEmitter();
  @Output() EmployeeDeleteEvent = new EventEmitter();
  @Output() EmployeeDeactivateEvent = new EventEmitter();
  constructor(
    private appComponentData: AppComponent,
    private confirmationService: ConfirmationService,
    private appCommonService: AppCommonService
  ) { }

  ngOnInit() {
    this.newEmployeeResources = MastersResource.getResources().en.addnewemployee;
    this.globalResource = GlobalResources.getResources().en;
    this.appComponentData.setTitle('Employee');
    this._cookieService = this.appCommonService.getUserProfile();
    this.userType = this._cookieService.UserRole;
  }
  onPageChange(e) {
    this.event = e;
  }
  editEmployee(EmpId) {
    // this.GetLotDetailsForEdit(EmpId);
    // alert(EmpId);
    this.EmployeeEditEvent.emit(EmpId);
  }
  deleteEmployee(EmpId, newemployee, IsDeleted, ActiveInactiveFlag) {
    // this.GetLotDetailsForEdit(EmpId);
    // alert(EmpId);
    this.EmployeeDeleteEvent.emit({EmpId, newemployee, IsDeleted, ActiveInactiveFlag});
  }
  deactivateEmployee(EmpId, newemployee, IsDeleted, ActiveInactiveFlag) {
    // this.GetLotDetailsForEdit(EmpId);
    // alert(EmpId);
    this.EmployeeDeactivateEvent.emit({EmpId, newemployee, IsDeleted, ActiveInactiveFlag});
  }
  // GetLotDetailsForEdit(EmpId) {
    // this.loaderService.display(true);
    // alert('Edit:' + EmpId);
    // this.OnEditEvent.emit(EmpId);
    // this.addNewEmployeeComponent.EmployeeOnEdit();
 // }

  onNewProductTypeSaved(comment) {
    console.log('New method implemented..');
  }
  showConformationMessaegForDelete(EmpId, newemployee, IsDeleted, ActiveInactiveFlag) {
    // alert(EmpId);
    let strMessage: any;
    strMessage = 'Do you want to delete this employee?';
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.deleteEmployee(EmpId, newemployee, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
          // this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
  });
  }
  showConformationMessaegForDeactive(EmpId, newemployee, rowIndex, IsDeleted, ActiveInactiveFlag) {
    let strMessage: any;
    if (newemployee.IsActive === true) {
      strMessage = 'Do you want to activate this employee?';
    } else {
      strMessage = 'Do you want to deactivate this employee?';
    }
    this.confirmationService.confirm({
      message: strMessage,
      header: 'Confirmation',
      icon: 'fa fa-exclamation-triangle',
      accept: () => {
        this.deactivateEmployee(EmpId, newemployee, IsDeleted, ActiveInactiveFlag);
      },
      reject: () => {
        newemployee.IsActive = !newemployee.IsActive;
      }
  });
  }
}
