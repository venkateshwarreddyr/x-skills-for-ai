// exp/x-skills-for-ai/browser/lib/hooks.js
let hookStates = new Map();
let currentComponentId = null;
let currentHookIndex = 0;

export function setCurrentComponent(id) {
  currentComponentId = id;
  currentHookIndex = 0;
}

export function useState(initialValue) {
  if (!currentComponentId) {
    throw new Error('useState must be called within a component');
  }
  let componentHooks = hookStates.get(currentComponentId) || [];
  const index = currentHookIndex++;
  if (componentHooks[index] === undefined) {
    componentHooks[index] = typeof initialValue === 'function' ? initialValue() : initialValue;
  }
  const value = componentHooks[index];
  const setValue = (newValue) => {
    componentHooks[index] = typeof newValue === 'function' ? newValue(componentHooks[index]) : newValue;
    hookStates.set(currentComponentId, componentHooks);
    if (window.forceUpdate) {
      window.forceUpdate();
    }
  };
  return [value, setValue];
}

export function useSkill(skillDef) {
  // defineSkill imported from skill-registry
  if (window.defineSkill) {
    window.defineSkill(skillDef);
  }
}

// Export for convenience
window.useState = useState;
window.useSkill = useSkill;
window.setCurrentComponent = setCurrentComponent;