import { effect, Injectable, signal } from '@angular/core';
import { AvailableSlotsResponse, PersonalData } from '../types/data.types';

@Injectable({
  providedIn: 'root',
})
export class SimpleStoreService {
  // Due to time restraints I decided to use this simple service instead of ngrx or ngxs solution
  // as well as omit certain type checks and error handling for these values
  readonly selectedTimeslot = signal<string | undefined>(undefined);
  readonly selectedDate = signal<Date | undefined>(undefined);
  readonly selectedDateKey = signal<string | undefined>(undefined);
  readonly selectedPersonalData = signal<PersonalData | undefined>(undefined);
  readonly availableSlotsResponse = signal<AvailableSlotsResponse>({
    slots: {},
  });

  constructor() {
    effect(() => {
      const snapshot = [
        this.selectedTimeslot(),
        this.selectedDate(),
        this.selectedDateKey(),
        this.selectedPersonalData(),
        this.availableSlotsResponse(),
      ];
      console.log('Store changed:', snapshot);
    });
  }
}
