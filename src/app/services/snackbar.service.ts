import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar : MatSnackBar) { }
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  openSnackBar(message: any,isSuccess:boolean,duration?: number) {
    let snackBarRef = this.snackBar.open(message, '', {
      duration: duration ? duration : 3000, 
      horizontalPosition: this.horizontalPosition, // 'start' | 'center' | 'end' | 'left' | 'right'
      verticalPosition: this.verticalPosition, // 'top' | 'bottom'
      panelClass: isSuccess ? 'snack-bar-success' : 'snack-bar-error'
    });
   return snackBarRef;
  }
}
