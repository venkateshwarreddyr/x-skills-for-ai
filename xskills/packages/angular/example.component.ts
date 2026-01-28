import { Component } from '@angular/core';
import { XSkillDefinition } from 'xskills-core';
import { XSkillDirective } from './src/xskills.directive';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [XSkillDirective],
  template: `
    <div xSkill [xSkill]="skillDef">
      <h1>Count: {{ count }}</h1>
      <p>Open console and run: await getXSkillsRuntime().execute('increment')</p>
    </div>
  `
})
export class CounterExample {
  count = 0;

  skillDef: XSkillDefinition = {
    id: 'increment',
    description: 'Increase the counter by 1',
    handler: () => this.count++
  };
}