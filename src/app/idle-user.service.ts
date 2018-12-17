import { AppCommonService } from './shared/services/app-common.service';
import { Injectable, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Idle, EventTargetInterruptSource, AutoResume } from '@ng-idle/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CookieService } from 'ngx-cookie-service';

const STORE_KEY =  'LOGOUT_MODAL_KEY';

@Injectable()
export class IdleUserService implements OnDestroy {
  public showLogoutModal: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public LogoutModalParams: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  newProductTypeDetailsActionService: any;
  idleState = 'NOT_STARTED';
  timedOut = false;

  private onIdleStart: Subscription;
  private onIdleEnd: Subscription;
  private onTimeoutWarning: Subscription;
  private onTimeout: Subscription;

  public logoutModalObject = {
    count: 0,
    progressCount: 0,
    countMinutes: 0,
    countSeconds: 0,
    loggedOut: false
  };
  // private onInterrupt: EventEmitter<any>;
  // public get element(): ElementRef {
  //   return this._element;
  // }
  // public set element(value: ElementRef) {
  //   this._element = value;
  // }

  constructor(
    private idle: Idle,
    private appCommonService: AppCommonService
    // private _element: ElementRef
  ) {
  }

  get logoutModalFlag() {
    return localStorage.getItem(STORE_KEY) === 'true' ? true : false;
  }
  set logoutModalFlag(value) {
    localStorage.setItem(STORE_KEY, String(value));
  }

  setInterrupts(element) {
    // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    this.idle.setInterrupts([
      new EventTargetInterruptSource(
        element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')
    ]);
  }

  initiaization(element) {
    if (!this.idle.isRunning() && (Number(this.appCommonService.getUserProfile().AutoLogoutValue) > 0
          && Number(this.appCommonService.getUserProfile().IdleLogoutValue) > 0)) {
      this.logoutModalObject.loggedOut = false;
      // this.logoutModalFlag = false;
        if (this.logoutModalFlag) {
          this.logoutModalFlag = false;
          // sets an idle timeout for 15 minutes
          this.idle.setIdle(0.5);
          // sets a timeout period of 5 minutes
          this.idle.setTimeout(this.appCommonService.getUserProfile().AutoLogoutValue);
        } else {
          // sets an idle timeout for 15 minutes
          this.idle.setIdle(this.appCommonService.getUserProfile().IdleLogoutValue);
          // sets a timeout period of 5 minutes
          this.idle.setTimeout(this.appCommonService.getUserProfile().AutoLogoutValue);
        }

          this.setInterrupts(element);

          this.onIdleEnd =
          this.idle.onIdleEnd.subscribe(() => {
            this.idleState = 'NO_LONGER_IDLE';
          });

          // this.onTimeout = this.idle.onTimeout;
          // if (this.onTimeout && this.onTimeout.observers.length > 0) { this.onTimeout = null; }
          this.onTimeout =
          this.idle.onTimeout.subscribe(() => {
            this.idleState = 'TIME_OUT';
            this.timedOut = true;
            this.logoutModalObject.loggedOut = true;
            this.idle.stop();
            this.logout();
            this.closeProgressForm();
            this.displayLogoutModalParams(this.logoutModalObject);
          });

          // this.onIdleStart = this.idle.onIdleStart;
          // if (this.onIdleStart && this.onIdleStart.observers.length > 0) { this.onIdleStart = null; }
          this.onIdleStart =
          this.idle.onIdleStart.subscribe(() => {
            this.idleState = 'IDLE_START', this.openProgressForm(1);
          });

          // this.onTimeoutWarning = this.idle.onTimeoutWarning;
          // if (this.onTimeoutWarning && this.onTimeoutWarning.observers.length > 0) { this.onTimeoutWarning = null; }
          this.onTimeoutWarning =
          this.idle.onTimeoutWarning.subscribe((countdown: any) => {
            this.idleState = 'IDLE_TIME_IN_PROGRESS';
            this.logoutModalObject.count = (Math.floor((countdown - 1) / 60) + 1);
            this.logoutModalObject.progressCount = this.reverseNumber(countdown);
            this.logoutModalObject.countMinutes = (Math.floor(countdown / 60));
            this.logoutModalObject.countSeconds = countdown % 60;

            this.displayLogoutModalParams(this.logoutModalObject);
          });

          // sets the ping interval to 15 seconds
          // keepalive.interval(15);
          /**
           *  // Keepalive can ping request to an HTTP location to keep server session alive
           * keepalive.request('<String URL>' or HTTP Request);
           * // Keepalive ping response can be read using below option
           * keepalive.onPing.subscribe(response => {
           * // Redirect user to logout screen stating session is timeout out if if response.status != 200
           * });
           */

          this.reset();
    }
  }

  setIdle(value) {
     // sets an idle timeout for 15 minutes
     this.idle.setIdle(value);
  }

  setTimeout(value) {
     // sets a timeout period of 5 minutes
     this.idle.setTimeout(value);
  }
  // ng-idle functions
  ngOnDestroy() {
    this.logoutModalFlag = false;
    this.resetTimeOut();
  }

  reverseNumber(countdown: number) {
    return (60 - (countdown - 1));
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openProgressForm(count: number) {
    this.display(true);
    this.logoutModalFlag = true;
    this.idle.clearInterrupts();
    // this.idle.stop();
    // this.progressBarPopup = this.ngbModal.open(ProgressBarModalComponent, {
    //   backdrop: 'static',
    //   keyboard: false
    // });
    // this.progressBarPopup.componentInstance.count = count;
    // this.progressBarPopup.result.then((result: any) => {
    //   if (result !== '' && 'logout' === result) {
    //     this.logout();
    //   } else {
    //     this.reset();
    //   }
    // });
  }

  logout() {
    // this.logoutModalFlag = false;
    this.idle.clearInterrupts();
    // this.idle.stop();
    this.resetTimeOut();
  }

  closeProgressForm() {
    // this.progressBarPopup.close();
    this.logoutModalFlag = false;
    this.display(false);
  }

  resetTimeOut() {
    if (this.onIdleStart) { this.onIdleStart.unsubscribe(); }
    if (this.onTimeoutWarning) { this.onTimeoutWarning.unsubscribe(); }
    if (this.onIdleEnd) { this.onIdleEnd.unsubscribe(); }
    this.idle.stop();
  }
  // end ng-idle functions

  display(value: boolean) {
    setTimeout(() => {
      this.showLogoutModal.next(value);
    }, 0);
  }

  displayLogoutModalParams(value: any) {
    setTimeout(() => {
      this.LogoutModalParams.next(value);
    }, 0);
  }
}
