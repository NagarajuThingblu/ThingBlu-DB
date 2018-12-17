import { AppConstants } from './../models/app.constants';
import { CustomMenuItem } from './../models/CustomMenuItem.model';
import { element } from 'protractor';
import { Component, OnInit , NgModule, Input} from '@angular/core';
import { UserModel } from './../models/user.model';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {MenubarModule} from 'primeng/menubar';
import {TieredMenuModule} from 'primeng/tieredmenu';
import { AuthenticationService } from '../services/authentication.service';
import { UserInterface } from '../interface/user.interface';
import { CookieService } from 'ngx-cookie-service';
import { trigger, state, style, transition, animate} from '@angular/animations';
import * as _ from 'lodash';
import { AppCommonService } from '../services/app-common.service';
import { UserRolePermissionService } from '../../admin/services/user-role-permission.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
   animations: [

    trigger('toggleHeight', [
      state('inactive', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px'

      })),
      state('active', style({
        overflow: 'hidden',
        height: '*',

      })),
      transition('active <=> inactive', animate('400ms ease-in-out'))

  //  transition('inactive => active', animate('500ms ease'))

  ])
   ]
})
export class SidebarComponent implements OnInit {

  status = false;
  @Input() inputClass: any;

  items: CustomMenuItem[];
  originalItems: CustomMenuItem[];
  item: MenuItem;

  public navText: String;

  public loggedInUsername: string;
  public userInterface: UserInterface;
  public userModel: UserModel;
  public userRoles: any;
  public userRoleName: any ;

  lastCookie = document.cookie; // 'static' memory between function calls
  plottedmenuItems: any =  [];
  RolesAccessData: any = [];
  menuItems: any =  {
    id: null,
    label: '',
    icon: '',
    routerLink: '',
    name: '',
    num: null,
    isParent: null,
    parentId: null,
    subState: null,
    arrow: null
};

  public userRoleWisePageList: any;

  navigationSubState: any = {
    1: 'inactive',
    2: 'inactive',
    3: 'inactive',
    4: 'inactive',
    5: 'inactive',
    6: 'inactive',
    7: 'inactive'
  };
  arrow: any = {
    1: 'pull-right-container',
    2: 'pull-right-container',
    3: 'pull-right-container',
    4: 'pull-right-container',
    5: 'pull-right-container',
    6: 'pull-right-container',
    7: 'pull-right-container'
  };
  // toggleNavigationSub(menuName: string, event: Event) {
  //       event.preventDefault();
  //     //  alert(menuName);
  //      // alert(this.navigationSubState[menuName]);
  //       this.items[menuName] = (this.items[menuName] === 'inactive' ? 'active' : 'inactive');
  //   }
  MenuName: string;
 // wasClicked = false;
    toggleNavigationSub(index: number, event: Event) {
      event.preventDefault();
     this.plottedmenuItems[index].subState = (this.plottedmenuItems[index].subState === 'inactive' ? 'active' : 'inactive');
     this.plottedmenuItems[index].arrow = (this.plottedmenuItems[index].arrow === 'pull-right-container' ? 'pull-right-containerr' : 'pull-right-container');

    //     this.navigationSubState[index] = (this.navigationSubState[index] === 'inactive' ? 'active' : 'inactive');
    //     this.arrow[index] = (this.arrow[index] === 'pull-right-container' ? 'pull-right-containerr' : 'pull-right-container');
       // this.status = !this.status;
      // subModuleee.active = !subModuleee.active;
     // this.wasClicked= !this.wasClicked;


  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    private appCommonService: AppCommonService,
    private userRolePermissionService: UserRolePermissionService,
  ) {

  }

//   SidebarComponent.window.addEventListener("orientationchange", function() {
//     alert(window.orientation);
// }, false);



  ngOnInit() {
      this.userModel = this.appCommonService.getUserProfile();
      this.userRoles = AppConstants.getUserRoles;
      this.userRoleName = this.appCommonService.getUserProfile().UserRole;
     // alert(this.inputClass);
      // setTimeout(() => {
        this.PlotSidebarMenu1();
      // }, 10);
  }
  PlotSidebarMenu() {
      if (this.userModel.UserRole === this.userRoles.Manager) {
        this.items = [
          {
            label: 'New Lot Entry',
            icon: 'fa-cube',
            'routerLink': 'lotentry',
            name: 'newLot',
            newLot: 'inactive',
            num: 1
          },
          {
            label: 'Lot List',
            icon: 'fa-cube',
            'routerLink': 'lotlisting',
            name: 'newList',
            newLot: 'inactive',
            num: 2
          },
          // {
          //     label: 'Lot Tracking Details',
          //     icon: 'fa-page',
          //     'routerLink': 'lottracking'
          // },
          {
              label: 'Order',
              icon: 'fa-shopping-cart',
              num: 3,
              items: [
                  {
                      label: 'Order Request',
                      icon: 'fa-plus',
                      'routerLink': 'orderrequestform'
                  },
                  {
                    label: 'All Orders',
                    icon: 'fa-plus',
                    'routerLink': 'orderlisting'
                  },
                  // {
                  //   label: 'Order Return Form',
                  //   icon: 'fa-plus',
                  //   'routerLink': 'orderreturn'
                  // }
              ]
          },
          {
              label: 'Assign Task',
              icon: 'fa-list-alt',
              'routerLink': 'assigntask',
              num: 4,
              // items: [
              //     {label: 'Assign Task', icon: 'fa-plus', routerLink: 'assigntask' }


              //     // {label: 'Search Task', icon: 'fa-search', routerLink: 'searchtask' },
              // ],
              name: 'Task',
          },
          // {
          //   label: 'Dashboard',
          //   icon: 'fa-dashboard',
          //   num: 5,
          //   items: [
          //     {label: 'Manager Dashboard', routerLink: 'managerdashboard' },
          //     {label: 'Joints Production Dashboard', routerLink: 'jointsproductiondashboard' }
          //   ]
          // },
          {
            label: 'Manager Dashboard',
            icon: 'fa-dashboard',
            'routerLink': 'managerdashboard',
            name: 'Dashboard',
            num: 5
          },
          {
            label: 'Joints Production Dashboard',
            icon: 'fa-dashboard',
            'routerLink': 'jointsproductiondashboard',
            name: 'Dashboard',
            num: 6
          },
          {
            label: 'Other Materials',
            icon: 'fa-flask',
            num: 7,
            items: [
                {label: 'Other Materials Out', routerLink: 'oilmaterialsout' },
                {label: 'Other Materials In', routerLink: 'oilmaterialsin' },
                {label: 'Other Materials Out - Full List', routerLink: 'oiloutword' },
                {label: 'Other Materials In - Full List', routerLink: 'oilinword' }
              ]
           },

          {
            label: 'Masters',
            icon: 'fa-list',
            num: 8,
            items: [
              {label: 'Strain Type', routerLink: 'straintypemaster' },
              {label: 'Genetics', routerLink: 'addnewsgenetics' },
              {label: 'Strain', routerLink: 'strainmaster' },
              {label: 'Brand', routerLink: 'addnewbrand' },
              {label: 'Sub Brand', routerLink: 'addnewsubbrand' },
              {label: 'Package Type', routerLink: 'addnewpackagetype' },
              {label: 'Product Type', routerLink: 'newproducttype' },
              {label: 'Grower', routerLink: 'grower' },
              {label: 'TP Processor', routerLink: 'tpprocessor' },
              {label: 'TP Prcsr. Pkg. Type', routerLink: 'addtpppackagetype' },
              // {label: 'City', routerLink: 'city' }  ,
              // {label: 'Client', routerLink: 'client' },
              {label: 'Retailer', routerLink: 'retailer' },
              {label: 'Employee', routerLink: 'addemployee' },
              // Added by DEVDAN :: 03-Oct-2018 :: Adding Link for Task Setting
              {label: 'Task Setting', routerLink: 'tasksetting' },
              // End of Added by DEVDAN
            ]
          },
      ];
    } else {
      this.items = [
        // {
        //     label: 'Task',
        //     icon: 'fa-tasks',
        //     items: [
        //         {label: 'Search Task', icon: 'fa-search', routerLink: 'searchtask' },
        //     ]
        // },
        {
          label: 'Lot List',
          icon: 'fa-cube',
          'routerLink': 'lotlisting',
          name: 'newList',
          newLot: 'inactive',
          num: 1
        },
        {
          label: 'Custom Task',
          icon: 'fa-list-alt',
          'routerLink': 'assigntask',
          name: 'Task',
          Task: 'inactive'
        },
        // {
        //   label: 'Dashboard',
        //   icon: 'fa-dashboard',
        //   num: 3,
        //   items: [
        //     {label: 'My Dashboard', routerLink: 'empdashboard' },
        //     {label: 'Joints Production Dashboard', routerLink: 'jointsproductiondashboard' }
        //   ]
        // },
        {
          label: 'My Dashboard',
          icon: 'fa-dashboard',
          'routerLink': 'empdashboard',
          name: 'Dashboard',
          num: 3
        },
        {
          label: 'Joints Production Dashboard',
          icon: 'fa-dashboard',
          'routerLink': 'jointsproductiondashboard',
          name: 'Dashboard',
          num: 4
        },

      //   {
      //     label: 'Oil Details',
      //     items: [
      //         {label: 'Oil Processing Details', routerLink: 'oilmaterialsout' },
      //         {label: 'Oil Return Processing Details', routerLink: 'oilmaterialsin' }
      //       ]
      //   }
    ];
    }

     // this.originalItems = _.cloneDeep(this.items);
     this.originalItems = JSON.parse(JSON.stringify(this.items));

  }
  logOut() {
    this.cookieService.deleteAll();
    this.router.navigate(['login']);
  }

  searchNav() {
    if (String(this.navText).trim() !== '') {
      let oObject: any[];

      // oObject = _.cloneDeep(this.originalItems);
      oObject = JSON.parse(JSON.stringify(this.originalItems));
      this.items = this.searchFilter3(this.navText, oObject, []);
    } else {
      this.items = JSON.parse(JSON.stringify(this.originalItems));
    }
    // this.items = this.searchFilter2(this.navText, this.originalItems);
  }

  // searchFilter2(search: any, directories: any[]) {
  //   let results = [];
  //   if (String(search).trim() !== '') {
  //     for (const directory of directories) {
  //         if (String(directory.label).toLocaleLowerCase().indexOf(String(search).toLocaleLowerCase()) >= 0) {
  //           results.push(directory);
  //         }
  //         if (directory.items && directory.items.length > 0) {
  //           results = [...results, ...this.searchFilter2(search, directory.items)];
  //         }
  //     }
  //     return results;
  //   } else {
  //     return this.originalItems;
  //   }
  // }

  searchFilter3(search: any, directories: any[], parentDirectory: any) {
    let results = [];
    const parentItemsLength = parentDirectory.items ? parentDirectory.items.length : 0;
    parentDirectory.items = [];
    let flagSearch = false;

    for (const directory of directories) {
      if (String(directory.label).toLocaleLowerCase().indexOf(String(search).toLocaleLowerCase()) >= 0) {
        flagSearch = true;
        if (parentItemsLength) {
          parentDirectory.items.push(directory);
        } else if (directory.items) {
          if (directory.items.length <= 0) {
            results.push(directory);
          }
        } else {
          results.push(directory);
        }
      }
      if (directory.items && directory.items.length > 0) {
        results = [...results, ...this.searchFilter3(search, directory.items, directory)];
      }
    }

    if (parentItemsLength && flagSearch) {
      results.push(parentDirectory);
    }
    return results;
  }

  PlotSidebarMenu1() {
    this.userRolePermissionService.getRolewiseMenuItem().subscribe(
      data => {
        if (data !== 'No data found!') {
         this.menuItems = data;
        if (this.menuItems) {
        this.rolewiseMenuItem();
        this.createMenuObject();
        }
      } else {
        this.menuItems = [];
        this.addSuperAdminPage();
      }
      },
      error => { console.log(error); },
      () => console.log('Get all clients complete'));
  }

  rolewiseMenuItem() {
    this.RolesAccessData = this.menuItems;
    if (this.cookieService.get('RoleAccess')) {
      this.cookieService.delete('RoleAccess', './');
      this.setCookie('RoleAccess', this.appCommonService.Encrypt(JSON.stringify(this.RolesAccessData)), new Date('12/31/9999').toUTCString());
      this.lastCookie = document.cookie;
    } else {
      this.setCookie('RoleAccess', this.appCommonService.Encrypt(JSON.stringify(this.RolesAccessData)), new Date('12/31/9999').toUTCString());
      this.lastCookie = document.cookie;
    }
  }

  setCookie(cname, cvalue, expiretime) {
    const expires = 'expires=' + expiretime;
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  createMenuObject() {
    // tslint:disable-next-line:prefer-const
    let unparentlist: any = [];
    // tslint:disable-next-line:no-shadowed-variable
    this.menuItems.forEach(element => {
      const Newmenu: any =  {};
      Newmenu.id = element.id;
      Newmenu.label = element.label;
      Newmenu.icon = element.icon;
      Newmenu.routerLink = element.routerLink;
      Newmenu.name = element.name;
      Newmenu.num = element.num;
      Newmenu.items = [];
      Newmenu.isParent = element.isParent;
      Newmenu.parentId = element.parentId;

      if (element.id === 3 ) {
      Newmenu.subState = 'active' ;
      Newmenu.arrow = 'pull-right-containerr';
       } else {
        Newmenu.subState = 'inactive' ;
        Newmenu.arrow = 'pull-right-container';
       }
        if (Newmenu.isParent === true ) {
          this.plottedmenuItems.push(Newmenu);
          if (unparentlist.length) {
                this.plottedmenuItems.forEach(unparent => {
                  if (unparent.id === Newmenu.id ) {
                    unparentlist.filter(r => r.parentId === Newmenu.id).forEach(unparentelement => {
                      const unparentMenu: any =  {};
                      unparentMenu.id = unparentelement.id;
                      unparentMenu.label = unparentelement.label;
                      unparentMenu.icon = unparentelement.icon;
                      unparentMenu.routerLink = unparentelement.routerLink;
                      unparentMenu.name = unparentelement.name;
                      unparentMenu.num = unparentelement.num;
                      unparentMenu.items = [];
                      unparentMenu.isParent = unparentelement.isParent;
                      unparentMenu.parentId = unparentelement.parentId;
                      unparent.items.push(unparentMenu);
                    });
                  }
                 });
              }
      }  else if ( element.isParent === false) {
            if (this.plottedmenuItems.length) {
          this.plottedmenuItems.forEach(parent => {
          if (parent.id === element.parentId ) {
           parent.items.push(Newmenu);
          } else {
            unparentlist.push(Newmenu);
          }
         });
        } else {
          unparentlist.push(Newmenu);
        }
      }
    });

    if (this.userRoleName === 'SuperAdmin' ) {
    const roleMenu: any =  {};
    roleMenu.id = 0;
    roleMenu.label = 'Master Role Access';
    roleMenu.icon = 'fa-unlock-alt';
    roleMenu.routerLink = 'masteruserroleaccess';
    roleMenu.name = 'Master Role Access';
    roleMenu.num = 100;
    roleMenu.items = [];
    roleMenu.isParent = true ;
    roleMenu.parentId = 0;
    roleMenu.subState = 'inactive' ;
    roleMenu.arrow = 'pull-right-container';
    this.plottedmenuItems.push(roleMenu);
  }
    this.items = this.plottedmenuItems;
  }

  addSuperAdminPage() {
    if (this.userRoleName === 'SuperAdmin' ) {
      const roleMenu: any =  {};
      roleMenu.id = 0;
      roleMenu.label = 'Master Role Access';
      roleMenu.icon = 'fa-unlock-alt';
      roleMenu.routerLink = 'masteruserroleaccess';
      roleMenu.name = 'Master Role Access';
      roleMenu.num = 100;
      roleMenu.items = [];
      roleMenu.isParent = true ;
      roleMenu.parentId = 0;
      roleMenu.subState = 'inactive' ;
      roleMenu.arrow = 'pull-right-container';
      this.plottedmenuItems.push(roleMenu);
    }
      this.items = this.plottedmenuItems;
  }
}




