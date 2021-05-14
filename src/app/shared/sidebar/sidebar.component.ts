import { AppConstants } from './../models/app.constants';
import { CustomMenuItem } from './../models/CustomMenuItem.model';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import { UserModel } from './../models/user.model';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as _ from 'lodash';
import { AppCommonService } from '../services/app-common.service';

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
    ])
  ]
})

export class SidebarComponent implements OnInit {
  @Input() inputClass: any;
  status = false;
  items: CustomMenuItem[];
  originalItems: CustomMenuItem[];
  item: MenuItem;
  plottedmenuItems: any = [];
  menuItems: any = [];

  public navText: String;
  public userModel: UserModel;
  public userRoles: any;
  public userRoleName: any;
  public xyz ={
    hight : ''
  } 

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

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private appCommonService: AppCommonService,
  ) { }

  ngOnInit() {
    this.userModel = this.appCommonService.getUserProfile();
    this.userRoles = AppConstants.getUserRoles;
    this.userRoleName = this.appCommonService.getUserProfile().UserRole;
    this.PlotSidebarMenu1();
  }

  toggleNavigationSub(index: number, event: Event) {
    this.xyz.hight = 'Nothighlight'
      event.preventDefault();
      this.plottedmenuItems[index].subState = (this.plottedmenuItems[index].subState === 'inactive' ? 'active' : 'inactive');
      this.plottedmenuItems[index].arrow = (this.plottedmenuItems[index].arrow === 'pull-right-container' ? 'pull-right-containerr' : 'pull-right-container');
    //  this.xyz.hight = 'hightlight'
    
    //      this.navigationSubState[index] = (this.navigationSubState[index] === 'inactive' ? 'active' : 'inactive');
    //      this.arrow[index] = (this.arrow[index] === 'pull-right-container' ? 'pull-right-containerr' : 'pull-right-container');
    //      this.status = !this.status;
    //      subModuleee.active = !subModuleee.active;
    //      this.wasClicked= !this.wasClicked;
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
    if (this.appCommonService.getRoleAccess()) {
      this.menuItems = this.appCommonService.getRoleAccess();

      this.createMenuObject();
    } else {
      this.menuItems = [];
    }
  }

  createMenuObject() {
    // tslint:disable-next-line:prefer-const
    let unparentlist: any = [];
    this.menuItems = this.menuItems.filter(r => r.IsShowAsMenu === true);
    if (this.menuItems && this.menuItems.length) {
      // tslint:disable-next-line:no-shadowed-variable
      this.menuItems.forEach(element => {
        const Newmenu: any = {};
        Newmenu.id = element.Id;
        Newmenu.label = element.Label;
        Newmenu.icon = element.Icon;
        Newmenu.routerLink = element.RouterLink;
        Newmenu.name = element.Name;
        Newmenu.num = element.Num;
        Newmenu.items = [];
        Newmenu.isParent = element.IsParent;
        Newmenu.parentId = element.ParentId;
        Newmenu.subState = element.SubState;
        Newmenu.arrow = element.SideArrow;
        Newmenu.IsDefault = element.IsDefaultPage;

        if (Newmenu.isParent === true) {
          this.plottedmenuItems.push(Newmenu);
          if (unparentlist.length) {
            this.plottedmenuItems.forEach(unparent => {
              if (unparent.id === Newmenu.id) {
                unparentlist.filter(r => r.parentId === Newmenu.id).forEach(unparentelement => {
                  const unparentMenu: any = {};
                  unparentMenu.id = unparentelement.id;
                  unparentMenu.label = unparentelement.label;
                  unparentMenu.icon = unparentelement.icon;
                  unparentMenu.routerLink = unparentelement.routerLink;
                  unparentMenu.name = unparentelement.name;
                  unparentMenu.num = unparentelement.num;
                  unparentMenu.items = [];
                  unparentMenu.isParent = unparentelement.isParent;
                  unparentMenu.parentId = unparentelement.parentId;
                  unparentMenu.subState = unparentelement.subState;
                  unparentMenu.arrow = unparentelement.sideArrow;
                  unparentMenu.IsDefault = unparentelement.IsDefault;
                  unparent.items.push(unparentMenu);
                });
              }
            });
          }
        } else if (element.IsParent === false) {
          if (this.plottedmenuItems.length) {
            this.plottedmenuItems.forEach(parent => {
              if (parent.id === element.ParentId) {
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
    }
    this.items = this.plottedmenuItems;
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
          ]
        },
        {
          label: 'Assign Task',
          icon: 'fa-list-alt',
          'routerLink': 'assigntask',
          num: 4,
          name: 'Task',
        },
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
            { label: 'Other Materials Out', routerLink: 'oilmaterialsout' },
            { label: 'Other Materials In', routerLink: 'oilmaterialsin' },
            { label: 'Other Materials Out - Full List', routerLink: 'oiloutword' },
            { label: 'Other Materials In - Full List', routerLink: 'oilinword' }
          ]
        },

        {
          label: 'Masters',
          icon: 'fa-list',
          num: 8,
          items: [
            { label: 'Strain Type', routerLink: 'straintypemaster' },
            { label: 'Genetics', routerLink: 'addnewsgenetics' },
            { label: 'Strain', routerLink: 'strainmaster' },
            { label: 'Brand', routerLink: 'addnewbrand' },
            { label: 'Sub Brand', routerLink: 'addnewsubbrand' },
            { label: 'Package Type', routerLink: 'addnewpackagetype' },
            { label: 'Product Type', routerLink: 'newproducttype' },
            { label: 'Grower', routerLink: 'grower' },
            { label: 'TP Processor', routerLink: 'tpprocessor' },
            { label: 'TP Prcsr. Pkg. Type', routerLink: 'addtpppackagetype' },
            { label: 'Retailer', routerLink: 'retailer' },
            { label: 'Employee', routerLink: 'addemployee' },
            { label: 'Task Setting', routerLink: 'tasksetting' },
          ]
        },
      ];
    } else {
      this.items = [
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
      ];
    }
    this.originalItems = JSON.parse(JSON.stringify(this.items));
  }
}




