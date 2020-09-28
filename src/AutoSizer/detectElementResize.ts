/**
 * Detect Element Resize.
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * Forked from version 0.5.3; includes the following modifications:
 * 1) Guard against unsafe 'window' and 'document' references (to support SSR).
 * 2) Defer initialization code via a top-level function wrapper (to support SSR).
 * 3) Avoid unnecessary reflows by not measuring size for scroll events bubbling from children.
 * 4) Add nonce for style element.
 **/

export default function createDetectElementResize(nonce: any) {
  // Check `document` and `window` in case of server-side rendering
  const _window = typeof window !== 'undefined' ? window : global;

  const requestFrame = (fn: any) =>
    (
      _window.requestAnimationFrame || ((fn: any) => _window.setTimeout(fn, 20))
    )(fn);

  const cancelFrame = (id: any) =>
    (_window.cancelAnimationFrame || _window.clearTimeout)(id);

  const resetTriggers = function(element: any) {
    const triggers = element.__resizeTriggers__,
      expand = triggers.firstElementChild,
      contract = triggers.lastElementChild,
      expandChild = expand.firstElementChild;
    contract.scrollLeft = contract.scrollWidth;
    contract.scrollTop = contract.scrollHeight;
    expandChild.style.width = `${expand.offsetWidth + 1}px`;
    expandChild.style.height = `${expand.offsetHeight + 1}px`;
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
  };

  const checkTriggers = function(element: any) {
    return (
      element.offsetWidth !== element.__resizeLast__.width ||
      element.offsetHeight !== element.__resizeLast__.height
    );
  };

  const scrollListener = function(
    this: HTMLElement & {
      __resizeRAF__: number;
      __resizeLast__: any;
      __resizeListeners__: any[];
    },
    e: any
  ) {
    // Don't measure (which forces) reflow for scrolls that happen inside of children!
    if (
      e.target.className.indexOf('contract-trigger') < 0 &&
      e.target.className.indexOf('expand-trigger') < 0
    ) {
      return;
    }

    resetTriggers(this);
    if (this.__resizeRAF__) {
      cancelFrame(this.__resizeRAF__);
    }
    this.__resizeRAF__ = requestFrame(() => {
      if (checkTriggers(this)) {
        this.__resizeLast__.width = this.offsetWidth;
        this.__resizeLast__.height = this.offsetHeight;
        this.__resizeListeners__.forEach((fn: any) => {
          fn.call(this, e);
        });
      }
    });
  };

  const createStyles = function(doc: any) {
    if (!doc.getElementById('detectElementResize')) {
      const css = `
        .resize-triggers {
          visibility: hidden;
        }
        .resize-triggers, .resize-triggers > div,
        .contract-trigger:before {
          content: " ";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          overflow:
          hidden; z-index: -1;
        }
        .resize-triggers > div {
          background: #eee;
          overflow: auto;
        }
        .contract-trigger:before {
          width: 200%;
          height: 200%;
        }
        `,
        head = doc.head || doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

      style.id = 'detectElementResize';
      style.type = 'text/css';

      if (nonce != null) {
        style.setAttribute('nonce', nonce);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(doc.createTextNode(css));
      }

      head.appendChild(style);
    }
  };

  const addResizeListener = function(element: any, fn: any) {
    if (!element.__resizeTriggers__) {
      const doc = element.ownerDocument;
      const elementStyle = _window.getComputedStyle(element);
      if (elementStyle && elementStyle.position === 'static') {
        element.style.position = 'relative';
      }
      createStyles(doc);
      element.__resizeLast__ = {};
      element.__resizeListeners__ = [];
      (element.__resizeTriggers__ = doc.createElement('div')).className =
        'resize-triggers';
      element.__resizeTriggers__.innerHTML =
        '<div class="expand-trigger"><div></div></div>' +
        '<div class="contract-trigger"></div>';
      element.appendChild(element.__resizeTriggers__);
      resetTriggers(element);
      element.addEventListener('scroll', scrollListener, true);
    }
    element.__resizeListeners__.push(fn);
  };

  const removeResizeListener = function(element: any, fn: any) {
    element.__resizeListeners__.splice(
      element.__resizeListeners__.indexOf(fn),
      1
    );
    if (!element.__resizeListeners__.length) {
      element.removeEventListener('scroll', scrollListener, true);
      if (element.__resizeTriggers__.__animationListener__) {
        element.__resizeTriggers__.__animationListener__ = null;
      }
      try {
        element.__resizeTriggers__ = !element.removeChild(
          element.__resizeTriggers__
        );
      } catch (e) {
        // Preact compat; see developit/preact-compat/issues/228
      }
    }
  };

  return {
    addResizeListener,
    removeResizeListener,
  };
}
