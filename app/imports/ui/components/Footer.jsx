import React from 'react';
import { Container } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    return (
        <footer>
              Department of Information and Computer Sciences <br />
          <Container fluid textAlign="center" className="footer">
            Campus Cloud
            <br />
            <br />
            Made with love and aloha.
          </Container>
        </footer>
    );
  }
}

export default Footer;
