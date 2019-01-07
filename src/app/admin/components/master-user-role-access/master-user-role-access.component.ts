
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { LoaderService } from '../../../shared/services/loader.service';
import { AppCommonService } from '../../../shared/services/app-common.service';
import { GlobalResources } from '../../../global resource/global.resource';
import { DropdownValuesService } from '../../../shared/services/dropdown-values.service';
import { DropdwonTransformService } from '../../../shared/services/dropdown-transform.service';
import { UserRolePermissionService } from '../../services/user-role-permission.service';
import { MastersResource } from '../../../Masters/master.resource';


@Component({
  selector: 'app-master-user-role-access',
  templateUrl: './master-user-role-access.component.html',
  styles: [' .clsRoleAccessTree .ui-tree { width: 100% !important; }']
})
export class MasterUserRoleAccessComponent implements OnInit {
  roleAccessForm: FormGroup;
  roleAccessResources: any;
  globalResource: any;
  public msgs: any[];
  public userRoles: any = [];
  public files: any = [];
  public selectedMenu: any = [];
  public selectedmenuItems: any[];
  public isRoleSelected: any = false;
  public cookie_clientId: any = 0;
  public cookie_virtualRoleId: any = 0;
  public selecteduserRoleId: any = 0;

  plottedmenuItems: any = [];
  menuItems: any = {
    id: null,
    label: '',
    icon: '',
    routerLink: '',
    name: '',
    num: null,
    isParent: null,
    parentId: null
  };

  constructor(private fb: FormBuilder,
    private loaderService: LoaderService,
    private dropdownDataService: DropdownValuesService,
    private dropdwonTransformService: DropdwonTransformService,
    private userRolePermissionService: UserRolePermissionService,
    private appCommonService: AppCommonService
  ) { }

  ngOnInit() {
    this.roleAccessResources = MastersResource.getResources().en.roleAccessPermisssion;
    this.globalResource = GlobalResources.getResources().en;
    this.cookie_clientId = this.appCommonService.getUserProfile().ClientId;
    this.cookie_virtualRoleId = this.appCommonService.getUserProfile().VirtualRoleId;
    this.roleAccessForm = this.fb.group({
      'userRoles': new FormControl(null, Validators.required)
    });
    this.getAllRoles();
  }

  getAllRoles() {
    this.loaderService.display(true);
    this.dropdownDataService.getRoleList().subscribe(
      data => {
        if (data !== 'No data found!') {
        this.userRoles = this.dropdwonTransformService.transform(data, 'RoleName', 'RoleId', '-- Select --');
        } else {
          this.userRoles = [];
        }
      },
      error => { console.log(error); },
      () => console.log('Get all roles complete'));
      this.loaderService.display(false);
  }

  getMasterList() {
    this.loaderService.display(true);
    this.userRolePermissionService.getMasterPageListByUserRoleId(this.roleAccessForm.value.userRoles).subscribe(
      data => {
        if (data !== 'No data found!') {
        this.menuItems = data.Table;
        if (this.menuItems) {
          this.plotMenuObject();
        } else {
          this.menuItems = [];
        }
      }
      },
      error => { console.log(error); },
      () => console.log('Get all clients complete'));
      this.loaderService.display(false);
  }

  plotMenuObject() {
    // tslint:disable-next-line:prefer-const
    let unparentlist: any = [];
    this.plottedmenuItems = [];
    this.selectedmenuItems = [];

    this.menuItems.forEach(element => {
      const Newmenu: any = {};
      Newmenu.id = element.Id;
      Newmenu.label = element.Label;
      Newmenu.icon = '';
      Newmenu.routerLink = element.RouterLink;
      Newmenu.name = element.Name;
      Newmenu.num = element.Num;
      Newmenu.children = [];
      Newmenu.isParent = element.IsParent;
      Newmenu.parentId = element.ParentId;
      Newmenu.roleMapId = element.RoleMapId;

      if (element.IsDefaultPage === true && element.HasPermission === true) {
        Newmenu.selectable = false;
      } else {
        Newmenu.selectable = true;
      }

      if (element.HasPermission) {
        this.selectedmenuItems.push(Newmenu);
      }

      if (Newmenu.isParent === true) {
        this.plottedmenuItems.push(Newmenu);
        if (unparentlist.length) {
          this.plottedmenuItems.forEach(unparent => {
            if (unparent.id === Newmenu.id) {
              unparentlist.filter(r => r.parentId === Newmenu.id).forEach(unparentelement => {
                const unparentMenu: any = {};
                unparentMenu.id = unparentelement.id;
                unparentMenu.label = unparentelement.label;
                unparentMenu.icon = '';
                unparentMenu.routerLink = unparentelement.routerLink;
                unparentMenu.name = unparentelement.name;
                unparentMenu.num = unparentelement.num;
                unparentMenu.children = [];
                unparentMenu.isParent = unparentelement.isParent;
                unparentMenu.parentId = unparentelement.parentId;
                unparentMenu.roleMapId = unparentelement.roleMapId;
                unparentMenu.selectable = unparentelement.selectable;
                unparent.children.push(unparentMenu);
              });
            }
          });
        }
      } else if (element.IsParent === false) {
        if (this.plottedmenuItems.length) {
          this.plottedmenuItems.forEach(parent => {
            if (parent.id === element.ParentId) {
              parent.children.push(Newmenu);
            } else {
              unparentlist.push(Newmenu);
            }
          });
        } else {
          unparentlist.push(Newmenu);
        }
      }
    });
    this.files = this.plottedmenuItems;
  }

  userRoleOnChange() {
    const RoleId = this.roleAccessForm.value.userRoles;
    if (RoleId >= 1) {
      this.selecteduserRoleId = RoleId;
      this.isRoleSelected = true;
      this.getMasterList();
    } else {
      this.isRoleSelected = false;
      this.selecteduserRoleId = 0;
      this.plottedmenuItems = [];
      this.selectedmenuItems = [];
    }
  }

  onSubmit(formModel) {

    if (this.roleAccessForm.valid) {
      this.loaderService.display(true);
      if (this.selectedmenuItems.length > 0) {
        const createRolePermissionApi = {
          RoleInfoDetails: {
            ClientId: this.cookie_clientId,
            RoleId: this.selecteduserRoleId,
            VirtualRoleId: this.cookie_virtualRoleId,
          },
          rolePermossionDetails: []
        };
        this.selectedmenuItems.forEach((element, index) => {
          createRolePermissionApi.rolePermossionDetails.push({
            Id: element.roleMapId,
            PageId: element.id,
            ClientId: this.cookie_clientId,
            RoleId: this.selecteduserRoleId,
            VirtualRoleId: this.cookie_virtualRoleId,
          });
        });
        this.loaderService.display(true);
        this.userRolePermissionService.createuserRolePermissionDetails(createRolePermissionApi)
          .subscribe(
            data => {
              this.msgs = [];
              if (String(data).toLocaleUpperCase() === 'SUCCESS') {
                this.roleAccessForm.reset();
                this.isRoleSelected = false;
                this.selecteduserRoleId = 0;
                this.plottedmenuItems = [];
                this.selectedmenuItems = [];

                this.msgs.push({ severity: 'success', summary: this.globalResource.applicationmsg, detail: this.roleAccessResources.roleaddedsuccs });
              } else if (data === 'Failure') {
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: this.globalResource.serverError });
              } else {
                this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: data });
              }
              this.loaderService.display(false);
            },
            error => {
              this.msgs = [];
              this.msgs.push({ severity: 'error', summary: this.globalResource.applicationmsg, detail: error.message });
              this.loaderService.display(false);
            });
      } else {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: this.globalResource.applicationmsg, detail: this.roleAccessResources.atlistoneRole });
      }
      this.loaderService.display(false);
    } else {
      this.appCommonService.validateAllFields(this.roleAccessForm);
    }
    this.loaderService.display(false);
  }
  resetAll() {
    this.roleAccessForm.reset();
    this.isRoleSelected = false;
    this.selecteduserRoleId = 0;
    this.plottedmenuItems = [];
    this.selectedmenuItems = [];
  }
  OnUnSelectNode(e) {
    if (e.node.isParent === false) {
      if (e.node.parent.selectable === false) {
       // this.selectedmenuItems.push(e.node.parent);
      }
    }
  }
}
