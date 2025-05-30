import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, LOCALE_ID } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NextStepButtonComponent } from '../../parts/next-step-buton/next-step-button.component';
import { HttpClient } from '@angular/common/http';
import { SimpleStoreService } from '../../../services/simple-store.service';
import { NavigationService } from '../../../services/navigation.service';
import { StepWrapperComponent } from '../../parts/step-wrapper/step-wrapper.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { IconTitleComponent } from '../../parts/icon-title/icon-title.component';
import { SummaryFieldComponent } from '../../parts/summary-field/summary-field.component';
import { countries } from '../../../constants/addresses';
import { take } from 'rxjs';
import { ThankYouPageService } from '../../../services/thank-you-page.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NextStepButtonComponent,
    StepWrapperComponent,
    MatCheckbox,
    ReactiveFormsModule,
    IconTitleComponent,
    SummaryFieldComponent,
  ],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'sk' }],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly store = inject(SimpleStoreService);
  private readonly datePipe = inject(DatePipe);
  private readonly thankYouService = inject(ThankYouPageService);
  private readonly navigationService = inject(NavigationService);

  personalData = this.store.selectedPersonalData()!;
  cityAndCountry = [
    this.personalData.cityId,
    countries.find((country) => country.id === this.personalData.countryId)
      ?.name,
  ].filter((val): val is string => typeof val === 'string'); // Because cityId can be undefined

  form = this.fb.group({
    vop: this.fb.control<boolean>(false, {
      validators: [Validators.requiredTrue],
    }),
    gdpr: this.fb.control<boolean>(false, {
      validators: [Validators.requiredTrue],
    }),
    marketing: this.fb.control<boolean>(false),
  });

  get selectedTime() {
    if (!this.store.selectedDateKey()) {
      throw new Error('No date selected');
    }

    const dateString = this.datePipe.transform(
      this.store.selectedDate(),
      'd. MMMM y'
    );

    const timeSlot = this.store.selectedTimeslot();
    if (!timeSlot) {
      throw new Error('No timeslot selected');
    }

    const time = this.store
      .availableSlotsResponse()
      .slots[this.store.selectedDateKey()!].find(
        (slot) => slot.id === timeSlot
      )?.time;
    if (!time) {
      throw new Error('No time with selected slot');
    }

    return `${dateString} o ${time}`;
  }

  onNextStepButtonClick() {
    if (this.form.valid) {
      const completionData = {
        id: this.store.selectedTimeslot(),
      };
      this.http
        .post('/api/complete', completionData)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.thankYouService.responseSuccess.set(true);
            this.navigationService.moveToNextStep();
          },
          error: (err) => {
            this.thankYouService.responseSuccess.set(false);
          },
        });
    }
  }
}
