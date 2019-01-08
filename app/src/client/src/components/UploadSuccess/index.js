import React from 'react';
import {Button} from 'react-bootstrap';
import FormWrapper from '../FormWrapper';

const UploadSuccess = ({onClick}) => (
  <FormWrapper>
    <h2>You successfuly uploaded a file.</h2>
    <Button type='button' bsStyle='primary' onClick={onClick}>
      See your documents
    </Button>
  </FormWrapper>
);

export default UploadSuccess;
