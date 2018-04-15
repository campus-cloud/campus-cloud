import React from 'react';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

/** Render a Not Found page if the user enters a URL that doesn't match any route. */
class NotFound extends React.Component {
  render() {
    const errorBoxStyle = {
      padding: '10px 0 20px',
      background: '#E3F2FD',
      textAlign: 'center',
    };

    return (
        <Container fluid style={{ padding: '0 0 50px', color: '#444', textAlign: 'center', fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif', lineHeight: 'normal' }}>
          <Container fluid style={errorBoxStyle}>
            <Container fluid style={{ margin: '20px', fontSize: '72px', color: '#2196F3' }}>We couldn’t find that!</Container>
            <Container fluid style={{ marginBottom: '30px', fontSize: '16px', color: '#64B5F6' }}>404 Not Found</Container>
          </Container>
          <Container fluid style={{ marginTop: '50px' }}>Sorry, that page or resource does not exist!</Container>
          <Container fluid style={{ marginTop: '25px' }}>Try the <Link to="/">home page</Link>.</Container>
        </Container>
    );
  }
}

export default NotFound;
