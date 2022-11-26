import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Service } from 'src/app/models/Services';
import { addDoc, collection } from "firebase/firestore";
import { CollectionReference, docSnapshots, DocumentData, Firestore, getFirestore } from '@angular/fire/firestore';
import { FirebaseApp, FirebaseApps, initializeApp } from '@angular/fire/app';
import { getDoc, getDocs } from '@firebase/firestore';
import { ref } from '@angular/fire/database';

export interface TaxType {
  id: number;
  detailTaxType: string
}

export interface Cities {
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
  invoiceDataForm: UntypedFormGroup;
  taxTypes: TaxType[];
  cities: Cities[];
  serviceList: Service[] = [];
  stepperOrientation: Observable<StepperOrientation>;

  constructor(private _formBuilder: UntypedFormBuilder, breakPointObserver: BreakpointObserver, private store: Firestore) {
    this.stepperOrientation = breakPointObserver.observe('(min-width:800px)').pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.invoiceDataForm = this._formBuilder.group({});

    this.taxTypes = [{ id: 1, detailTaxType: 'Cedula Ciudadanía' }, { id: 2, detailTaxType: 'Cedula Extranjería' }, { id: 3, detailTaxType: 'Tarjeta Identidad' }, { id: 4, detailTaxType: 'Pasaporte' }];
    this.cities = [{ id: 1, name: 'Bogotá DC', deliveryCost: 60000 }, { id: 2, name: 'Villa de Leyva', deliveryCost: 320000 }, { id: 3, name: 'Subachoque', deliveryCost: 180000 }, { id: 4, name: 'Duitama', deliveryCost: 300000 }, { id: 5, name: 'Chia', deliveryCost: 30000 }, { id: 6, name: 'Cota', deliveryCost: 40000 }];
  }

  ngOnInit(): void {
    this.buildForm();
    this.getParametrics();


  }
  buildForm() {
    this.invoiceDataForm = this._formBuilder.group({
      personalDataInformation: this._formBuilder.group({
        names: new UntypedFormControl('', [Validators.required]),
        lastNames: new UntypedFormControl('', [Validators.required]),
        birthday: new UntypedFormControl('', [Validators.required]),
        taxType: new UntypedFormControl('', [Validators.required]),
        taxNumber: new UntypedFormControl('', [Validators.required]),
        email: new UntypedFormControl('', []),
        instagram: new UntypedFormControl('', []),
      }),
      brideService: this._formBuilder.group({
        selectedService: new UntypedFormControl('', []),
        aditionalService: this._formBuilder.group({
          armorSkin: new UntypedFormControl('', []),
          accompaniment: new UntypedFormControl('', []),

        })
      }),
      weddingInformation: this._formBuilder.group({
        date: new UntypedFormControl('', []),
        city: new UntypedFormControl('', []),
        addres: new UntypedFormControl('', []),
        startindWeddingTime: new UntypedFormControl('', []),
        finalMakeupTime: new UntypedFormControl('', []),
      }),
      additionalServices: this._formBuilder.array([
        this._formBuilder.group({
          name: new UntypedFormControl('', []),
          cellphone: new UntypedFormControl('', []),
          details: new UntypedFormControl('', []),
          serviceType: new UntypedFormControl('', []),
        })
      ])
    })
  }

  get additionalServices() {
    return this.invoiceDataForm.controls['additionalServices'] as UntypedFormArray
  }

  addAdditionalService() {
    const additionalService = this._formBuilder.group({
      name: new UntypedFormControl('', [Validators.required]),
      cellphone: new UntypedFormControl('', [Validators.required]),
      serviceType: new UntypedFormControl('', [Validators.required]),
    })

    this.additionalServices.push(additionalService);
  }

  removeAdditionalService(additionalServiceIndex: number) {
    this.additionalServices.removeAt(additionalServiceIndex);
  }

  insertServices(service: CollectionReference<DocumentData>) {
    return addDoc(service, { data: this.serviceList })
  }


  async getParametrics() {
    const parametrics: CollectionReference<DocumentData> = collection(this.store, 'Parametrics')
    const services = await getDocs(parametrics)
    this.serviceList = [];

    const documents =(services.docs.map((doc) => doc.data()));
    this.serviceList = documents[0]['data'];

  }
}
