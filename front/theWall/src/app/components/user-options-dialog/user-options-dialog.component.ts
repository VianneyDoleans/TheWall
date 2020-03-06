import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { DialogData, User } from "../../models/theWall";
import { ApiService } from "../../services/api.service";

export class UserOptionsDialogData extends DialogData<boolean> {
  constructor(public user: User, response: boolean) {
    super(response);
  }
}

@Component({
  selector: 'app-user-options-dialog',
  templateUrl: './user-options-dialog.component.html',
  styleUrls: ['./user-options-dialog.component.scss']
})
export class UserOptionsDialogComponent implements OnInit {

  roles: string[] | string;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<UserOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserOptionsDialogData,
  ) { }

  ngOnInit() {
    this.roles = this.data.user.roles;
  }

  toggleRole(role: string) {
    if (!(this.roles instanceof Array)) {
      this.roles = this.roles.split('\n');
    }
    if (this.roles.includes(role)) {
      this.roles.splice(this.roles.findIndex(r => r === role), 1);
    } else {
      this.roles.push(role);
    }
  }

  save() {
    this.api.patch('users', this.data.user._id,
      { email: this.data.user.email, about: this.data.user.about, password: this.data.user.password, roles: this.roles })
      .then(() => this.dialogRef.close());
  }

  cancel() {
    this.dialogRef.close();
  }

}
