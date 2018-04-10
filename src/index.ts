import {NgModule, ModuleWithProviders} from '@angular/core';
import {GuageWithColorBandComponent} from './gauge';
import {CommonModule} from '@angular/common';

export * from './gaugeOptions';

export * from './sample.component';
export * from './sample.directive';
export * from './sample.pipe';
export * from './sample.service';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GuageWithColorBandComponent,
    ],
    exports: [
        GuageWithColorBandComponent,
    ]
})
export class GuageModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: GuageModule,
        };
    }
}
