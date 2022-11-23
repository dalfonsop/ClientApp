import { Component, Input } from '@angular/core';
import { Service } from 'src/app/models/Services';

@Component({
  selector: 'app-select-services',
  templateUrl: './select-services.component.html',
  styleUrls: ['./select-services.component.css']
})
export class SelectServicesComponent {
  @Input() services?: Service ;

}
