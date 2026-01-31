import { Component, signal } from '@angular/core';
import { XSkillDefinition } from '@x-skills-for-ai/core';
import { XSkillDirective } from '@x-skills-for-ai/angular';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [XSkillDirective],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
  count = signal(0);

  incrementDef: XSkillDefinition = {
    id: 'increment',
    description: 'Increase counter',
    handler: async () => {
      this.count.update(c => c + 1);
    }
  };

  decrementDef: XSkillDefinition = {
    id: 'decrement',
    description: 'Decrease counter',
    handler: async () => {
      this.count.update(c => c - 1);
    }
  };

  increment() {
    this.count.update(c => c + 1);
  }

  decrement() {
    this.count.update(c => c - 1);
  }
}
