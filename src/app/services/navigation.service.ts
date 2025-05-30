import { Injectable, signal } from '@angular/core';

export enum Steps {
  Timeslot,
  PersonalData,
  Summary,
  Finalization,
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  startingStep = Steps.Timeslot;
  currentStep = signal(this.startingStep);

  moveToNextStep() {
    this.currentStep.update((currentStep) => currentStep + 1);
  }
}
