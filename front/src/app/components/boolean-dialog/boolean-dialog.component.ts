import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogData } from "../../models/theWall";

export class BooleanDialogData extends DialogData<boolean> {
  constructor(public title, public message, response: boolean) {
    super(response);
  }
}

@Component({
  selector: 'app-boolean-dialog',
  templateUrl: './boolean-dialog.component.html',
  styleUrls: ['./boolean-dialog.component.scss']
})
export class BooleanDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BooleanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BooleanDialogData,
  ) { }

  ngOnInit() {
  }

  onResult(choice: boolean) {
    this.data.response = choice;
    this.dialogRef.close();
  }

}
