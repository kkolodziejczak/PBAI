import React from 'react';

class SharesList extends React.Component {
  _renderShare = (share, i) => (
    <li key={i} style={{marginBottom: 20}}>
      <div>
        <strong>Id: </strong>
        {share.id}
      </div>
      {/* <div>
        <strong>Name: </strong>
        {doc.name}
      </div>
      <div style={{marginBottom: 10}}>
        <strong>Encrypted content:</strong>
        {doc.content}
      </div> */}
    </li>
  );

  _renderShares = () => this.props.shares.map(this._renderShare);

  render() {
    const {shares} = this.props;
    if (!shares || shares.length === 0) {
      return <h4>The list is empty.</h4>;
    }
    return <ol>{this._renderShares()}</ol>;
  }
}

export default SharesList;
