import React from 'react';
import './style.scss';

class ScreenWrapper extends React.Component {
  render() {
    const {title, children, titleCenter, maxWidth} = this.props;
    return (
      <div className="ScreenWrapper_container container" style={{maxWidth: maxWidth ? `${maxWidth}px` : null}}>
        {title && <h1 style={{textAlign: titleCenter ? 'center' : null}}>{title}</h1>}
        {children}
      </div>
    );
  }
}

export default ScreenWrapper;
