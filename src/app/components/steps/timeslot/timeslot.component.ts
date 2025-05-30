import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { StepWrapperComponent } from '../../parts/step-wrapper/step-wrapper.component';
import { NextStepButtonComponent } from '../../parts/next-step-buton/next-step-button.component';
import { MatCalendar } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { AvailableSlotsResponse, Timeslot } from '../../../types/data.types';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../../../services/navigation.service';
import { SimpleStoreService } from '../../../services/simple-store.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-timeslot',
  standalone: true,
  imports: [
    CommonModule,
    StepWrapperComponent,
    NextStepButtonComponent,
    MatCalendar,
    MatNativeDateModule,
    MatButton,
  ],
  providers: [DatePipe],
  templateUrl: './timeslot.component.html',
  styleUrl: './timeslot.component.scss',
})
export class TimeslotComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly navigationService = inject(NavigationService);
  private readonly store = inject(SimpleStoreService);
  private readonly datePipe = inject(DatePipe);
  readonly today = new Date();

  // NOTE: As some behavior is not specified (e.g. what happens when the date is changed after user already selected a
  // timeslot, what happens when clicking date without any available timeslot, what happens when selecting current
  // date/how long in the future are slots invalid, what other validations are needed for dates and timeslots...),
  // I decided to do this step in a simple way, without use of reactive forms. They will be used on other steps
  // NOTE 2: There were things I did (disabling past dates) or wanted to resolve (like those mentioned above), but in
  // the end I decided to keep it simple, as they would require me to contact the UX designer for clarification

  selectedDate = signal<Date | undefined>(undefined);
  selectedDateAvailableSlots = signal<Timeslot[]>([]);
  selectedSlotId = signal<string | undefined>(undefined);

  dateClassFn?: (date: Date) => string;

  ngOnInit() {
    // In real application I would put urls in an environment file
    this.http
      .get<AvailableSlotsResponse>('/api/available-slots')
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.store.availableSlotsResponse.set(response);
          this.dateClassFn = this.dateClass.bind(this);
        },
        error: (err) => {
          console.error('Error', err);
        },
      });
  }

  onDateChange(date: Date | null) {
    this.selectedSlotId.set(undefined);
    if (!date || !(date instanceof Date)) {
      this.selectedDate.set(undefined);
      this.selectedDateAvailableSlots.set([]);
    }

    this.selectedDate.set(date as Date);
    const dateKey = this.dateKey(date as Date);

    if (dateKey && dateKey in this.store.availableSlotsResponse().slots) {
      this.selectedDateAvailableSlots.set(
        this.store.availableSlotsResponse().slots[dateKey].map((slot) => ({
          id: slot.id,
          time: slot.time,
        }))
      );
    } else {
      this.selectedDateAvailableSlots.set([]);
    }
  }

  onSlotClick(slotId: string) {
    this.selectedSlotId.set(slotId);
  }

  onNextStepButtonClick() {
    // In the task it is mentioned that slot should be saved > endpoint should be called
    // however, I found no mention of any corresponding endpoint in the task, nor on the github project page
    if (this.selectedSlotId() && this.selectedDate()) {
      this.store.selectedTimeslot.set(this.selectedSlotId());
      this.store.selectedDate.set(this.selectedDate());
      this.store.selectedDateKey.set(this.dateKey(this.selectedDate()!));
      this.navigationService.moveToNextStep();
    }
  }

  dateClass(date: Date) {
    const dateKey = this.dateKey(date);

    return dateKey && dateKey in this.store.availableSlotsResponse().slots
      ? 'slot-available'
      : '';
  }

  dateKey(date: Date): string {
    const dateKey = this.datePipe.transform(date, 'dd/MM/yyyy');
    if (!dateKey) {
      throw Error('Invalid date format');
    }
    return dateKey;
  }
}
