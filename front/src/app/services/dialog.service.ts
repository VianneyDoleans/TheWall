import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { BooleanDialogComponent, BooleanDialogData } from "../components/boolean-dialog/boolean-dialog.component";
import { DialogData } from "../models/theWall";

@Injectable()
export class DialogService {

  private dialogRef: MatDialogRef<any, any>;
  private subdialogRef: MatDialogRef<any, any>;
  private drawerDialogRef: MatDialogRef<any, any>;

  constructor(private dialog: MatDialog) { }

  public openDialog<T>(dialogComponent: any, data?: DialogData<T>, panelClass?: string): Promise<any> {
    if (this.dialogRef) {
      return Promise.reject('Already open');
    }
    this.dialogRef = this.dialog.open(dialogComponent, {
      width: '50%',
      data: data,
      panelClass: panelClass
    });

    return this.dialogRef.afterClosed().toPromise()
      .then(res => {
        this.dialogRef = undefined;
        return res;
      });
  }

  public openDialogDrawer<T>(dialogComponent: any, data?: DialogData<T>, panelClass?: string): Promise<any> {
    if (this.drawerDialogRef) {
      return Promise.reject('Already open');
    }
    this.drawerDialogRef = this.dialog.open(dialogComponent, {
      width: '70%',
      height: '80%',
      data: data,
      panelClass: panelClass
    });

    return this.drawerDialogRef.afterClosed().toPromise()
      .then(res => {
        this.drawerDialogRef = undefined;
        return res;
      });
  }

  public openSubDialog<T>(dialogComponent: any, data?: DialogData<T>, panelClass?: string): Promise<any> {
    if (this.subdialogRef) {
      return Promise.reject('SubDialog is already open');
    }
    this.subdialogRef = this.dialog.open(dialogComponent, {
      width: '25%',
      data: data,
      panelClass: panelClass
    });

    return this.subdialogRef.afterClosed().toPromise()
      .then(res => {
        this.subdialogRef = undefined;
        return res;
      });
  }

  public openBooleanDialog(message: string, title = 'Are you sure ?', subDialog = false, panelClass?: string): Promise<boolean> {
    const response = new BooleanDialogData(title, message, false);

    if (subDialog) {
      return this.openSubDialog(BooleanDialogComponent, response, panelClass)
        .then(() => response.response);
    }
    return this.openDialog(BooleanDialogComponent, response, panelClass)
      .then(() => response.response);
  }

  public closeAll() {
    if (this.drawerDialogRef) {
      this.drawerDialogRef.close();
    }
    if (this.subdialogRef) {
      this.subdialogRef.close();
    }
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

}
