import React from 'react';
import {Button} from 'react-bootstrap';
import Spinner from 'react-activity/lib/Spinner';

const SubmitButton = ({text, loading, className, onClick}) => (
  <Button type='submit' bsStyle='primary' className={className ? className : 'pull-right'} onClick={onClick}>
    {loading ? <Spinner color='white' /> : text}
  </Button>
);

export default SubmitButton;
