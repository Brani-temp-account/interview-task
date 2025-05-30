import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-next-step-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './next-step-button.component.html',
  styleUrl: './next-step-button.component.scss',
})
export class NextStepButtonComponent {
  disabled = input(false);
  clicked = output();

  onClick() {
    this.clicked.emit();
  }
}
