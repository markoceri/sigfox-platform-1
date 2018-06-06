import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-demo',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  private filterQuery = '';

  constructor() {
  }

  ngOnInit(): void {
    console.log('Test: ngOnInit');
  }

  ngOnDestroy(): void {
    console.log('Test: ngOnDestroy');
  }

}
