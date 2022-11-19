import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';


export interface TaxType{
  id: number;
  detailTaxType: string
}

export interface Cities{
  id: number;
  name: string;
  deliveryCost: number;
}

@Component({
  selector: 'app-invoice-data',
  templateUrl: './invoice-data.component.html',
  styleUrls: ['./invoice-data.component.css']
})

export class InvoiceDataComponent implements OnInit {
  invoiceDataForm: FormGroup;
  taxTypes: TaxType[];
  cities: Cities[];
  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: FormBuilder, breakPointObserver: BreakpointObserver) {
    this.stepperOrientation = breakPointObserver.observe('(min-width:800px)').pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.invoiceDataForm = this._formBuilder.group({});

    this.taxTypes = [{id: 1, detailTaxType: 'Cedula Ciudadanía'},{id: 2, detailTaxType: 'Cedula Extranjería'},{id: 3, detailTaxType: 'Tarjeta Identidad'},{id: 4, detailTaxType: 'Pasaporte'}];
    this.cities = [{id:1, name:'Bogotá DC', deliveryCost: 60000}, {id:2, name:'Villa de Leyva', deliveryCost:320000}, {id:3, name:'Subachoque', deliveryCost:180000}, {id:4, name:'Duitama', deliveryCost: 300000}, {id:5, name:'Chia', deliveryCost:30000}, {id:6, name:'Cota', deliveryCost: 40000}];
  }

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.invoiceDataForm = this._formBuilder.group({
      personalDataInformation: this._formBuilder.group({
        names: new FormControl('', [Validators.required]),
        lastNames: new FormControl('', [Validators.required]),
        birthday: new FormControl('', [Validators.required]),
        taxType: new FormControl('', [Validators.required]),
        taxNumber: new FormControl('', [Validators.required]),
        email: new FormControl('', []),
        instagram: new FormControl('', []),
      }),
      brideService: this._formBuilder.group({
        selectedService: new FormControl('', []),
        aditionalService: this._formBuilder.group({
          armorSkin: new FormControl('', []),
          accompaniment: new FormControl('', []),

        })
      }),
      weddingInformation: this._formBuilder.group({
        date: new FormControl('', []),
        city: new FormControl('', []),
        addres: new FormControl('', []),
        startindWeddingTime: new FormControl('', []),
        finalMakeupTime: new FormControl('', []),
      }),
      additionalServices: this._formBuilder.array([
        this._formBuilder.group({
          name: new FormControl('', []),
          cellphone: new FormControl('', []),
          details: new FormControl('',[]),
          serviceType: new FormControl('', []),
        })
      ])
    })
  }

  get additionalServices() {
    return this.invoiceDataForm.controls['additionalServices'] as FormArray
  }

  addAdditionalService() {
    const additionalService = this._formBuilder.group({
      name: new FormControl('', [Validators.required]),
      cellphone: new FormControl('', [Validators.required]),
      serviceType: new FormControl('', [Validators.required]),
    })

    this.additionalServices.push(additionalService);
  }

  removeAdditionalService(additionalServiceIndex: number) {
    this.additionalServices.removeAt(additionalServiceIndex);
  }

  gpdf() {
    const a = `  <div style="border: 5%;color: pink;border-style: dotted;">
    <h5 style="text-align: center;font-size: medium;">Dermeva</h5>
    <h1 style="text-align: center;font-size: medium">Cuenta de Cobro</h1>
    <h3 style="text-align: center;font-size: medium"> Daniel Alfonso</h3>

    <br>
    <br>


  </div>`;

html2canvas(a,{scale:3 }).then((canvas) => {
  const pdf = new jsPDF('p','mm','letter');
  pdf.html(a);
  pdf.save();
})}
