import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/parts/header/header.component';
import { NavigationService, Steps } from './services/navigation.service';
import { TimeslotComponent } from './components/steps/timeslot/timeslot.component';
import { PersonalDataComponent } from './components/steps/personal-data/personal-data.component';
import { SummaryComponent } from './components/steps/summary/summary.component';
import { FinalizationComponent } from './components/steps/finalization/finalization.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TimeslotComponent,
    PersonalDataComponent,
    SummaryComponent,
    FinalizationComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly Steps = Steps;

  private navigationService = inject(NavigationService);

  currentStep = this.navigationService.currentStep;
}
