import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sensorendata } from 'src/app/Sensorendata';
import {FormControl, Validators} from '@angular/forms';
import { StoreService } from 'src/app/shared/store.service';


@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.scss']
})
export class AddDialogComponent {
  sensorFormControl = new FormControl('', [Validators.pattern("[0-9]+"), Validators.required])
  temperatureFormControl = new FormControl('', [Validators.pattern("[0-9]+[\.]?[0-9]*"), Validators.required]);
  humidityFormControl = new FormControl('', [Validators.pattern("[0-9]+[\.]?[0-9]*"), Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Sensorendata,
    public storeService: StoreService,
  ) { }

  onNoClick(): void {
    this.dialogRef.close('No');
  }

  onYesClick(): void {
    this.dialogRef.close('Yes');
  }
}
