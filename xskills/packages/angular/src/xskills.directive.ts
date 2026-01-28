import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { XSkillDefinition, getXSkillsRuntime } from 'xskills-core';

@Directive({
  selector: '[xSkill]'
})
export class XSkillDirective implements OnInit, OnDestroy {
  @Input('xSkill') def!: XSkillDefinition;

  private unregister: (() => void) | null = null;

  ngOnInit(): void {
    if (this.def) {
      this.unregister = getXSkillsRuntime().register(this.def);
    }
  }

  ngOnDestroy(): void {
    this.unregister?.();
  }
}