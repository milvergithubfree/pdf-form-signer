import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
pdfDefaultOptions.assetsFolder = 'bleeding-edge';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pdf-form-viewer';

  ngOnInit(): void {
    initFlowbite();
  }
}
