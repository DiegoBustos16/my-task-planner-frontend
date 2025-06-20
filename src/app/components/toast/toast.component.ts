import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html'
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
}
