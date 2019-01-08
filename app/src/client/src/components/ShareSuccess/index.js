import React from 'react';
import FormWrapper from '../FormWrapper';

class ShareSuccess extends React.Component {
  render() {
    const {documentName, partnerName} = this.props;
    return (
      <div>
        <FormWrapper>
          <h2>
            You sucessfully shared{' '}
            <i>
              <strong>{documentName}</strong>
            </i>{' '}
            file with{' '}
            <i>
              <strong>{partnerName}</strong>
            </i>
            .
          </h2>
        </FormWrapper>
      </div>
    );
  }
}

export default ShareSuccess;
