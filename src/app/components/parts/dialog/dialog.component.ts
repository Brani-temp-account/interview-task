import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogContent, MatButton],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  dialogRef = inject(MatDialogRef<DialogComponent>);
  data = inject<{
    title: string;
    message: string;
    continueBtnText: string;
    refreshBtnText: string;
  }>(MAT_DIALOG_DATA);

  onClose(result: boolean) {
    this.dialogRef.close(result);
  }
}
