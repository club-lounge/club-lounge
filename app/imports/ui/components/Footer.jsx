import React from 'react';
import { Divider } from 'semantic-ui-react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px', paddingBottom: '15px', color: 'white' };
    return (
        <footer>
          <div style={divStyle} className="ui center aligned container">
            <Divider />
            <a href="https://club-lounge.github.io/">
              ICS 314 Final Project: Club Lounge</a> <br/>
              Department of Information and Computer Sciences <br />
              University of Hawaii<br />
              Honolulu, HI 96822 <br/>
          </div>
        </footer>
    );
  }
}

export default Footer;
