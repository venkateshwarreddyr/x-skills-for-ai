# xskills-angular

Angular directive for [xskills-core](..).

## Installation

```
npm install xskills-angular xskills-core @angular/core @angular/common @angular/platform-browser
```

## Usage

```ts
import { Component } from '@angular/core';
import { XSkillDefinition } from 'xskills-core';
import { XSkillDirective } from 'xskills-angular';

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
