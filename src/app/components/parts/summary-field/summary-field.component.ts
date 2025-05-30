import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-summary-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-field.component.html',
  styleUrl: './summary-field.component.scss',
})
export class SummaryFieldComponent {
  label = input.required<string>();
  value = input<string>();
  values = input<string[]>();
}
