import React from 'react';
import {Button} from 'react-bootstrap';
import Spinner from 'react-activity/lib/Spinner';

const SubmitButton = ({text, loading}) => (
  <Button type='submit' bsStyle='primary' className='pull-right'>
    {loading ? <Spinner color='white' /> : text}
  </Button>
);

export default SubmitButton;
