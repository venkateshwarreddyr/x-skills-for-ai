# @x-skills-for-ai/angular

Angular directive for [@x-skills-for-ai/core](..).

## Installation

```
npm install @x-skills-for-ai/angular
```

## Usage

```ts
import { Component } from '@angular/core';
import { XSkillDefinition } from 'xskills-core';
import { XSkillDirective } from '@x-skills-for-ai/angular';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [XSkillDirective],
  template: `
    <div xSkill [xSkill]="skillDef">
      <h1>Count: {{ count }}</h1>
      <p>Open console: await getXSkillsRuntime().execute('increment')</p>
    </div>
  `
})
export class CounterComponent {
  count = 0;

  skillDef: XSkillDefinition = {
    id: 'increment',
    description: 'Increase counter by 1',
    handler: () => this.count++
  };
}
```

The directive automatically registers the skill on init and unregisters on destroy.

See [example.component.ts](example.component.ts).
