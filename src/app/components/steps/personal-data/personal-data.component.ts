import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NextStepButtonComponent } from '../../parts/next-step-buton/next-step-button.component';
import { StepWrapperComponent } from '../../parts/step-wrapper/step-wrapper.component';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs';
import { SimpleStoreService } from '../../../services/simple-store.service';
import { PersonalData } from '../../../types/data.types';
import { NavigationService } from '../../../services/navigation.service';
import { cities, countries } from '../../../constants/addresses';
import { EMAIl_PATTERN } from '../../../constants/patterns';

export function birthNumberValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value || control.value.match(/^\d{6}\/\d{4}$/) === null) {
      return { invalidFormat: true };
    }

    const today = new Date();
    const yearPart = parseInt(control.value.substring(0, 2), 10);
    const monthPart = parseInt(control.value.substring(2, 4), 10);
    const dayPart = parseInt(control.value.substring(4, 6), 10);

    // Account for 50 added to month
    const month = monthPart > 50 ? monthPart - 50 : monthPart;

    // It is just assumed that year of birth is past year 2000,
    // if that would be in the future, we try 1900s
    let birthDate = new Date(2000 + yearPart, month - 1, dayPart);
    if (birthDate > today) {
      birthDate = new Date(1900 + yearPart, month - 1, dayPart);
    }

    const date18YearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    return birthDate <= date18YearsAgo ? null : { underage: true };
  };
}

@Component({
  selector: 'app-personal-data',
  standalone: true,
  imports: [
    CommonModule,
    NextStepButtonComponent,
    StepWrapperComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOption,
    MatSelect,
  ],
  templateUrl: './personal-data.component.html',
  styleUrl: './personal-data.component.scss',
})
export class PersonalDataComponent implements OnInit {
  // Since design shows City field as disabled, I decided to disable it
  // even though the task description says it should be hidden. In real scenario,
  // I would consult the designer go with the most consistent approach, in
  // respect to the other apps

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly store = inject(SimpleStoreService);
  private readonly navigationService = inject(NavigationService);

  form = this.fb.group({
    firstName: this.fb.control<string | undefined>(undefined, {
      validators: [Validators.required],
    }),
    lastName: this.fb.control<string | undefined>(undefined, {
      validators: [Validators.required],
    }),
    birthNumber: this.fb.control<string | undefined>(undefined, {
      validators: [Validators.required, birthNumberValidator()],
    }),
    countryId: this.fb.control<string | undefined>(undefined, {
      validators: [Validators.required],
    }),
    cityId: this.fb.control<string | undefined>(
      { value: undefined, disabled: true },
      {
        validators: [Validators.required],
      }
    ),
    email: this.fb.control<string | undefined>(undefined, {
      validators: [Validators.required, Validators.pattern(EMAIl_PATTERN)],
    }),
  });

  ngOnInit() {
    this.form.controls.countryId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((countryId) => {
        if (countryId === 'sk') {
          this.form.controls.cityId.enable();
        } else {
          this.form.controls.cityId.disable();
        }
      });
  }

  onNextStepButtonClick() {
    if (this.form.valid) {
      const personalData: PersonalData = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        birthNumber: this.form.value.birthNumber!,
        countryId: this.form.value.countryId!,
        cityId: this.form.value.cityId || undefined,
        email: this.form.value.email!,
      };

      this.http
        .post('/api/save-personal-data', personalData)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.store.selectedPersonalData.set(personalData);
            this.navigationService.moveToNextStep();
          },
          error: (err) => {
            // As the design does not specify what should happen in this case,
            // I'm just outputting to console
            console.error('Error', err);
          },
        });
    }
  }

  protected readonly countries = countries;
  protected readonly cities = cities;
}
