import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// import BlurredText from './subcomponents/BlurredText.js';
// import OpenMyStoryNow from './subcomponents/OpenMyStoryNow.js';

class Storyconcealed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //state here
    }
  }

  alert = () => {
    console.log("oh, hey");
  }

  render() {
    //variables, logic and so on here
      return (
        <div>
          <Container>
            <Row>
              <Col onClick={this.alert}>1 of 2</Col>
              <Col>2 of 2</Col>
              <Col>1 of 3</Col>
            </Row>
            <Row>
              <Col>1 of 3</Col>
              <Col>2 of 3</Col>
              <Col>3 of 3</Col>
            </Row>
            <Row>
              <Col>1 of 3</Col>
              <Col>2 of 3</Col>
              <Col>3 of 3</Col>
            </Row>
          </Container>
        </div>
      )
    }
  }

export default Storyconcealed;
