import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { NavigationService, Steps } from '../../../services/navigation.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { take } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly dialog = inject(MatDialog);

  hideContent = input<boolean>(false);

  currentStep = this.navigationService.currentStep;
  currentStepText = computed(() => {
    switch (this.currentStep()) {
      case Steps.Timeslot:
        return 'Vyber terminu';
      case Steps.PersonalData:
        return 'Vase udaje';
      case Steps.Summary:
        return 'Zhrnutie';
      default:
        return '';
    }
  });

  refresh() {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '640px',
      data: {
        title: 'Chystáte sa zrušiť rezervačný proces',
        message:
          'Naozaj chcete zrušiť proces rezervácie? Po tomto kroku stratíte uložené zmeny a v prípade opätovnej rezervácie bude potrebné spraviť celý proces odznova.',
        continueBtnText: 'Nie, chcem pokračovať',
        refreshBtnText: 'Áno, zrušiť rezerváciu',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((refresh) => {
        if (refresh) {
          window.location.reload();
        }
      });
  }
}
