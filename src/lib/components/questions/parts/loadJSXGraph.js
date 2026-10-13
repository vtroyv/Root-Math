// Loads JSXGraph from the CDN once per page and shares it between every board.
// The older components inject (and remove) their own <script> each time they mount;
// with several sketch/place parts on one page that would load the library repeatedly.
// Pinned to the version in package.json so a CDN update can't change behaviour.

const VERSION = '1.11.1';
let loading = null;

export default function loadJSXGraph() {
  if (window.JXG) return Promise.resolve(window.JXG);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = `https://cdn.jsdelivr.net/npm/jsxgraph@${VERSION}/distrib/jsxgraph.css`;
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = `https://cdn.jsdelivr.net/npm/jsxgraph@${VERSION}/distrib/jsxgraphcore.js`;
    script.onload = () => resolve(window.JXG);
    script.onerror = () => {
      loading = null;
      reject(new Error('Failed to load JSXGraph'));
    };
    document.head.appendChild(script);
  });
  return loading;
}
