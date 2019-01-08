import React from 'react';
import SubmitButton from '../SubmitButton';

class DocumentsList extends React.Component {
  _renderDocument = (doc, i) => (
    <li key={i} style={{marginBottom: 20}}>
      <div>
        <strong>Id: </strong>
        {doc.id}
      </div>
      <div>
        <strong>Name: </strong>
        {doc.name}
      </div>
      <div style={{marginBottom: 10}}>
        <strong>Encrypted content:</strong>
        {doc.content}
      </div>
      {doc.permissionType === 'o' && (
        <SubmitButton onClick={() => this.props.openShareForm(doc)} text='Share document' className=' ' />
      )}
    </li>
  );

  _renderDocuments = () => this.props.documents.map(this._renderDocument);

  render() {
    const {documents} = this.props;
    if (!documents || documents.length === 0) {
      return <h2>You did not upload any document yet.</h2>;
    }
    return <ol>{this._renderDocuments()}</ol>;
  }
}

export default DocumentsList;
