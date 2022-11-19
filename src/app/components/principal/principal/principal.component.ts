import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface Tariff {
  id: number;
  name: string;
  description: string;
  baseValue: number;
  margin: number;
  cost: number;
  utility: number;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  totalForm: FormGroup;
  cols = ['id', 'baseValue', 'cost', 'margin']
  objList: MatTableDataSource<Tariff>[] = [];
  objdata: MatTableDataSource<Tariff> = new MatTableDataSource();


  constructor(private _formBuilder: FormBuilder) {
    this.totalForm = this._formBuilder.group({});
  }

  ngOnInit(): void {

    this.objdata.data = [{ id: 1, baseValue: 100, cost: 0, description: 'bla bla', margin: 110, name: 'bla bla', utility: 102 },
    { id: 2, baseValue: 100, cost: 0, description: 'bla bla', margin: 110, name: 'bla bla', utility: 102 },
    { id: 3, baseValue: 100, cost: 0, description: 'bla bla', margin: 110, name: 'bla bla', utility: 102 },
    { id: 4, baseValue: 100, cost: 0, description: 'bla bla', margin: 110, name: 'bla bla', utility: 102 }]

    this.totalForm = this._formBuilder.group({
      data: this._formBuilder.array([])
    })
  }

  get list() {
    return this.totalForm.controls['data'] as FormArray
  }

  addAdditionalService() {
    const additionalService = this._formBuilder.group({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
    })

    this.list.push(additionalService);
    var newArray: MatTableDataSource<Tariff> = new MatTableDataSource();
    Object.assign(newArray,this.objdata);
    this.objList.push(newArray);
  }

  trackByItem(index: number, hero: any) {
    return index    
  }
  clonarElemento(elementoAntiguo:any,nuevoElemento:any = null){
    return Object.assign(elementoAntiguo,nuevoElemento);
  }

}