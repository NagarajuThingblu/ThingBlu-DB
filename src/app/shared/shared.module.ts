import { IdleUserService } from './../idle-user.service';
import { AppCommonService } from './services/app-common.service';
import { NgModule, ModuleWithProviders, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LotCommentComponent } from './components/lot-comment/lot-comment.component';
import { PopupLotCommentComponent } from './components/lot-comment/popup-lot-comment.component';

import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {CalendarModule} from 'primeng/calendar';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {GrowlModule} from 'primeng/growl';
import {DialogModule} from 'primeng/dialog';
import {DataGridModule} from 'primeng/datagrid';
import {FieldsetModule} from 'primeng/fieldset';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {MultiSelectModule} from 'primeng/multiselect';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SlideMenuModule} from 'primeng/slidemenu';
import {TabViewModule} from 'primeng/tabview';
import {PanelMenuModule} from 'primeng/panelmenu';
import {InputMaskModule} from 'primeng/inputmask';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {KeyFilterModule} from 'primeng/keyfilter';
import {TooltipModule} from 'primeng/tooltip';
import {ProgressBarModule} from 'primeng/progressbar';
import {TieredMenuModule} from 'primeng/tieredmenu';
import { InputSwitchModule } from 'primeng/inputswitch';
import {SidebarModule} from 'primeng/sidebar';

import { HeaderComponent } from './header/header.component';
import { AuthenticationService } from './services/authentication.service';
import { DropdownValuesService } from './services/dropdown-values.service';
import { DataService } from './services/DataService.service';
import { TaskCommonService } from '../task/services/task-common.service';
import {DataTableModule} from 'primeng/datatable';
import { AuthGuard } from '../guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../guards/auth.interceptor';
import { ErrorLogService } from './services/ErrorLog.service';
import { GlobalErrorHandler } from './error handler/global-error.handler';
import { CookieService } from 'ngx-cookie-service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StartupService } from './services/startup.service';
import { DynamicFormQuestionComponent } from './components/dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService } from './services/question-control.service';
import { QuestionService } from './services/question.service';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { DropdwonTransformService } from './services/dropdown-transform.service';
import { DropdownTransformPipe } from './pipes/dropdown-transform.pipe';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { OnlyNumberWithoutZeroDirective } from './directives/only-number-without-zero.directive';
import { LotNoteComponent } from '../lot/components/lotlisting/lot-note.component';
import { MinutesToTimePipe } from './pipes/minutes-to-time.pipe';
import { LotNoteIconComponent } from '../lot/components/lotlisting/lot-note-icon/lot-note-icon.component';
import { BrowserModule } from '@angular/platform-browser';
import { InprocessStatusPipe } from './pipes/inprocess-status.pipe';
import { EncDecPwdComponent } from './components/enc-dec-pwd/enc-dec-pwd.component';
import { NumberValidationMsgsComponent } from './components/number-validation-msgs/number-validation-msgs.component';
import { ErrorTooltipDirective } from './directives/error-tooltip.directive';
import { FormSubmitDirective } from './directives/form-submit.directive';
import { ScrollTopService } from './services/ScrollTop.service';
import { ToggleButtonModule } from 'primeng/primeng';
import { LotInventoryDetailsComponent } from './components/lot-inventory-details/lot-inventory-details.component';
import { ShrinkageLotClosePopupComponent } from './components/shrinkage-lot-close-popup/shrinkage-lot-close-popup.component';
import { PaginationCountsComponent } from './components/pagination-counts/pagination-counts.component';
import { ResetPasswordService } from './services/reset-password.service';
import { RoleGuard } from '../guards/role.guard';
import { UserRolePermissionService } from '../admin/services/user-role-permission.service';
import { ErrorAccessDeniededComponent } from './components/error-access-denieded/error-access-denieded.component';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { CharactersCountComponent } from './components/characters-count/characters-count.component';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';


@NgModule({
  declarations: [HeaderComponent, SidebarComponent, DynamicFormQuestionComponent, DynamicFormComponent,
      OnlyNumberDirective, DropdownTransformPipe,
      OnlyNumberWithoutZeroDirective,
      LotNoteComponent,
      MinutesToTimePipe,
      LotNoteIconComponent,
      InprocessStatusPipe,
      EncDecPwdComponent,
      ErrorTooltipDirective,
      FormSubmitDirective,
      NumberValidationMsgsComponent,
      LotInventoryDetailsComponent,
      ShrinkageLotClosePopupComponent,
      NumberValidationMsgsComponent,
      PaginationCountsComponent,
      ErrorAccessDeniededComponent,
      LotCommentComponent,
      PopupLotCommentComponent,
      SectionHeaderComponent,
      CharactersCountComponent
    ],
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    PanelModule,
    CalendarModule,
    AutoCompleteModule,
    SplitButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MenubarModule,
    CheckboxModule,
    InputTextareaModule,
    GrowlModule,
    DataTableModule,
    DialogModule,
    DataGridModule,
    FieldsetModule,
    CardModule,
    TableModule,
    MultiSelectModule,
    OverlayPanelModule,
    SlideMenuModule,
    TabViewModule,
    PanelMenuModule,
    InputMaskModule,
    ConfirmDialogModule,
    KeyFilterModule,
    TooltipModule,
    ProgressBarModule,
    TieredMenuModule,
    SidebarModule,
    InputSwitchModule,
    ToggleButtonModule,
    PasswordModule
  ],

  exports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    PanelModule,
    CalendarModule,
    AutoCompleteModule,
    SplitButtonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HeaderComponent,
    SidebarComponent,
    MenubarModule,
    CheckboxModule,
    InputTextareaModule,
    GrowlModule,
    DataTableModule,
    DialogModule,
    DataGridModule,
    FieldsetModule,
    CardModule,
    TableModule,
    MultiSelectModule,
    OverlayPanelModule,
    SlideMenuModule,
    DynamicFormQuestionComponent,
    DynamicFormComponent,
    TabViewModule,
    OnlyNumberDirective,
    OnlyNumberWithoutZeroDirective,
    PanelMenuModule,
    InputMaskModule,
    ConfirmDialogModule,
    KeyFilterModule,
    LotNoteComponent,
    MinutesToTimePipe,
    LotNoteIconComponent,
    TooltipModule,
    ProgressBarModule,
    InprocessStatusPipe,
    EncDecPwdComponent,
    NumberValidationMsgsComponent,
    TieredMenuModule,
    ErrorTooltipDirective,
    FormSubmitDirective,
    SidebarModule,
    InputSwitchModule,
    ToggleButtonModule,
    LotInventoryDetailsComponent,
    ShrinkageLotClosePopupComponent,
    ToggleButtonModule,
    PaginationCountsComponent,
    ErrorAccessDeniededComponent,
    LotCommentComponent,
    PopupLotCommentComponent,
    SectionHeaderComponent,
    CharactersCountComponent
  ]
})
// For Shared Services
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
          ErrorLogService, // register global error log service
          {                // register global error handler
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
          },
          AuthenticationService,
          DropdownValuesService,
          DataService,
          TaskCommonService,
          AuthGuard,
          CanDeactivateGuard,
          RoleGuard,
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
          },
          CookieService,
          QuestionControlService,
          QuestionService,
          ConfirmationService,
          DropdwonTransformService,
          AppCommonService,
          StartupService,
          ScrollTopService,
          ResetPasswordService,
          IdleUserService,
          UserRolePermissionService
        ]
    };
  }

}
