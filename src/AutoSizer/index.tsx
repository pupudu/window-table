import * as React from 'react';
// @ts-ignore
import createDetectElementResize from './detectElementResize';

type Size = {
  height: number;
  width: number;
};

type Props = {
  onResize: (Size: Size) => void;
  innerElementType: any;
};

type State = {
  height: number;
  width: number;
};

type ResizeHandler = (element?: HTMLElement, onResize?: () => void) => void;

type DetectElementResize = {
  addResizeListener: ResizeHandler;
  removeResizeListener: ResizeHandler;
};

export default class AutoSizer extends React.PureComponent<Props, State> {
  static defaultProps = {
    onResize: () => {},
  };

  state = {
    height: 0,
    width: 0,
  };

  _parentNode?: HTMLElement;
  _autoSizer?: HTMLElement | any;
  // @ts-ignore
  _detectElementResize: DetectElementResize;

  componentDidMount() {
    if (
      this._autoSizer &&
      this._autoSizer.parentNode &&
      this._autoSizer.parentNode.ownerDocument &&
      this._autoSizer.parentNode.ownerDocument.defaultView &&
      this._autoSizer.parentNode instanceof
        this._autoSizer.parentNode.ownerDocument.defaultView.HTMLElement
    ) {
      // Delay access of parentNode until mount.
      // This handles edge-cases where the component has already been unmounted before its ref has been set,
      // As well as libraries like react-lite which have a slightly different lifecycle.
      this._parentNode = this._autoSizer.parentNode;

      // Defer requiring resize handler in order to support server-side rendering.
      // See issue #41
      this._detectElementResize = createDetectElementResize('');
      this._detectElementResize.addResizeListener(
        this._parentNode,
        this._onResize
      );

      this._onResize();
    }
  }

  componentWillUnmount() {
    if (this._detectElementResize && this._parentNode) {
      this._detectElementResize.removeResizeListener(
        this._parentNode,
        this._onResize
      );
    }
  }

  render() {
    // Outer div should not force width/height since that may prevent containers from shrinking.
    // Inner component should overflow and use calculated width/height.
    // See issue #68 for more information.
    const outerStyle: any = { overflow: 'visible' };

    outerStyle.height = 0;
    outerStyle.width = 0;

    const Component = this.props.innerElementType || 'div';

    return <Component ref={this._setRef as any} style={outerStyle} />;
  }

  _onResize = () => {
    const { onResize } = this.props;

    if (this._parentNode) {
      // Guard against AutoSizer component being removed from the DOM immediately after being added.
      // This can result in invalid style values which can result in NaN values if we don't handle them.
      // See issue #150 for more context.

      const height = this._parentNode.offsetHeight || 0;
      const width = this._parentNode.offsetWidth || 0;

      const style = (window.getComputedStyle(this._parentNode) || {}) as any;
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;

      const newHeight = height - paddingTop - paddingBottom;
      const newWidth = width - paddingLeft - paddingRight;

      if (this.state.height !== newHeight || this.state.width !== newWidth) {
        this.setState({
          height: height - paddingTop - paddingBottom,
          width: width - paddingLeft - paddingRight,
        });

        onResize({ height, width });
      }
    }
  };

  _setRef = (autoSizer?: HTMLElement) => {
    this._autoSizer = autoSizer;
  };
}
