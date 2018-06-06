import {NgModule} from '@angular/core';
import {TestComponent} from './test.component';
import {TestRoutingModule} from './test-routing.module';
import {CommonModule} from '@angular/common';
import {DataFilterPipe} from './datafilterpipe';

@NgModule({
  imports: [
    TestRoutingModule,
    CommonModule
  ],
  declarations: [
    TestComponent,
    DataFilterPipe
  ]
})

export class TestModule {
}
