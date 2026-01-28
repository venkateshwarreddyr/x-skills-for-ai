// exp/x-skills-for-ai/browser/lib/renderer.js
let rootEl = null;

window.h = (type, props, ...children) => ({
  type,
  props: props || {},
  children: children.flat()
});

function vnodeToHtml(vnode) {
  if (typeof vnode === 'string') return vnode;
  let propsStr = '';
  if (vnode.props) {
    let styleStr = '';
    if (vnode.props.style) {
      styleStr = Object.entries(vnode.props.style).map(([k, v]) => `${k}: ${v}`).join('; ') + ';';
    }
    const otherProps = Object.entries(vnode.props).filter(([k, v]) => k !== 'style' && typeof v !== 'function').map(([k, v]) => `${k}="${String(v).replace(/"/g, '"')}"`).join(' ');
    propsStr = styleStr ? `style="${styleStr}" ${otherProps}`.trim() : otherProps;
  }
  const childrenHtml = vnode.children.map(vnodeToHtml).join('');
  return `<${vnode.type} ${propsStr}>${childrenHtml}</${vnode.type}>`;
}

function render() {
  if (!rootEl) return;

  // Set current component for hooks
  if (window.setCurrentComponent) {
    window.setCurrentComponent('root');
  }

  // User-defined App function returns VNode or string
  let vnodeOrHtml = typeof window.App === 'function' ? window.App() : null;
  let html = '<div style="font-family: Arial; padding: 20px;">App not loaded</div>';
  if (vnodeOrHtml) {
    html = typeof vnodeOrHtml === 'string' ? vnodeOrHtml : vnodeToHtml(vnodeOrHtml);
  }

  rootEl.innerHTML = html;

  // Update global app state if function available
  if (typeof window.getAppState === 'function') {
    window.globalAppState = window.getAppState();
  }

  // Default markdown serializer from DOM text content
  window.getMarkdownView = () => {
    if (!rootEl) return '# No app content';
    let text = rootEl.textContent.trim();
    return `# x-skills-for-ai Demo App\n\n${text}`;
  };
}

window.forceUpdate = render;
window.render = render;

// createRoot to init
window.createRoot = function(container) {
  rootEl = typeof container === 'string' ? document.querySelector(container) : container;
  if (rootEl) {
    render();
  }
};