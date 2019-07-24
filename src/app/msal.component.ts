import { AppCommonService } from './shared/services/app-common.service';
import { Title } from '@angular/platform-browser';
import { LoaderService } from './shared/services/loader.service';
import { HttpMethodsService } from './shared/services/http-methods.service';
import { MsalService } from './azureb2c/msal.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'msal.component.html',
  styleUrls: ['msal.component.css']
})
export class MsalComponent implements OnInit {
  public isPasswordResetSuccess = false;
  showLoader: boolean;

  constructor(private msalService: MsalService,
    private httpMethodsService: HttpMethodsService,
    private loaderService: LoaderService,
    private appCommonService: AppCommonService,
    private titleService: Title) {
      this.loaderService.display(true);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Reset password in-process');
    // this.loaderService.status.subscribe((val: boolean) => {
    //   this.showLoader = val;
    // });
      if (this.msalService.isOnline()) {
        this.updateEmpInfo(this.msalService.getUser().idToken['oid']);
      } else {
        this.msalService.logout();
        this.loaderService.display(false);
    }
  }

  updateEmpInfo(iD) {
    let updateUserApiDetails: any;
    updateUserApiDetails = {
      AzureUserId: iD
    };
    const xhr = this.postAjax(environment.apiEndpoint + 'api/Employee/UpdateAzureUserFlag', updateUserApiDetails,
      (data) => {

      });
  }

  postAjax(url, data, success) {
    const xhr = this.httpMethodsService.xhrFactories();
    xhr.open('POST', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.isPasswordResetSuccess = true;
        setTimeout(() => {
          this.loaderService.display(false);
          this.msalService.logout();
          success(xhr.responseText);
        }, 2000);
      } else if (xhr.readyState === 4 && xhr.status === 401) {
        this.loaderService.display(false);
        this.msalService.logout();
      } else {
        this.loaderService.display(false);
        this.msalService.logout();
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('b2c.todo.access.token'));
    xhr.send(JSON.stringify(data));
    return xhr;
  }
}
