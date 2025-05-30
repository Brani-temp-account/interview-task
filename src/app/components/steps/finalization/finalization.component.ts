import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThankYouPageService } from '../../../services/thank-you-page.service';
import { SimpleStoreService } from '../../../services/simple-store.service';

@Component({
  selector: 'app-finalization',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './finalization.component.html',
  styleUrl: './finalization.component.scss',
})
export class FinalizationComponent {
  thankYouService = inject(ThankYouPageService);
  store = inject(SimpleStoreService);

  success = this.thankYouService.responseSuccess();
  clientName = this.store.selectedPersonalData()?.firstName;

  redirect() {
    if (this.success) {
      window.open('https://nemocnicabory.sk', '_self');
    } else {
      // In a real app I'd prefer resetting store and redirecting to the first step,
      window.location.reload();
    }
  }
}
