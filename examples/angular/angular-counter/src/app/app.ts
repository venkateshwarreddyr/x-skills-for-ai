import { Component, signal } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('XSkills Counter Example');
}
