import { Component, OnInit } from '@angular/core';
import { LoaderService } from './shared/services/loader.service';
import { Title } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app';
    showLoader: boolean;

    constructor(
        private loaderService: LoaderService,
        private titleService: Title
    ) {
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
    }

    ngOnInit(): void {
        this.loaderService.status.subscribe((val: boolean) => {
            this.showLoader = val;
        });
    }
}

