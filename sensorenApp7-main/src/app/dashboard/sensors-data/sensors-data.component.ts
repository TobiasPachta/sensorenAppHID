import { Component, OnInit, ViewChild } from '@angular/core';
import { SensorPosition } from 'src/app/Sensor';
import { BackendService } from 'src/app/shared/backend.service';
import { StoreService } from 'src/app/shared/store.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sensorendata } from 'src/app/Sensorendata';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-sensors-data',
  templateUrl: './sensors-data.component.html',
  styleUrls: ['./sensors-data.component.scss']
})
export class SensorsDataComponent implements OnInit {
  dataSource!: MatTableDataSource<Sensorendata>;
  displayedColumns: string[] = ['id', 'temperature', 'humidity', 'date', 'sensorID', 'addEditButton'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public get SensorPosition() {return SensorPosition; }

  constructor(private backendService: BackendService, public storeService: StoreService, public dialog: MatDialog, private datePipe: DatePipe) { }

  public pages: number = 0;
  public currentPage: number = 1;


  async ngOnInit() {
    await this.getSensorendata()
  }

  async getSensorendata() {
    this.storeService.isLoading = true;
    await this.backendService.getSensoren();
    await this.backendService.getSensorenDaten();
    const dataArray: Sensorendata[] = this.storeService.sensorenDaten;
    console.log(dataArray)
    this.dataSource = new MatTableDataSource(dataArray)
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.storeService.isLoading = false;
  }

  async deleteSensordata(id: number) {
    this.storeService.isLoading = true;
    await this.backendService.deleteSensorsDaten(id);
    await this.getSensorendata();
    this.storeService.isLoading = false;
  }

  async selectPage(i: any) {
    this.storeService.isLoading = true;
    this.currentPage = i + 1;
    await this.backendService.getSensorenDaten();
    this.storeService.isLoading = false;
  }

  async addSensordata() {
    const measurement: Sensorendata = await this.openAddDialog()
    if (measurement == null) {
      return
    }
    var timeString = this.datePipe.transform(Date.now(), 'yyyy-MM-ddTHH:mm:ss.SSS');
    this.storeService.isLoading = true;
    measurement.date = new Date(Date.now());
    measurement.sensor = this.storeService.sensoren.filter(sensor => sensor.id == measurement.sensorID)[0]
    await this.backendService.addSensorsData(measurement);
    await this.getSensorendata();
    this.storeService.isLoading = false;
  }
  async openAddDialog(): Promise<Sensorendata> {
    var temperature
    var humidity
    var sensor
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: { sensorID: sensor, temperature: temperature, humidity: humidity },
    });

    return firstValueFrom(dialogRef.afterClosed()).then((res) => {
      if (res != 'No') {
        return res
      }
      return null
    })
  }
}
