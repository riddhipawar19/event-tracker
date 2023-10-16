import React from 'react';

class Demo extends React.Component {
  redirectToGoogle() {
    window.location.href = 'https://www.google.com';
  }

  render() {
    return (
      <div>
        <button onClick={this.redirectToGoogle}>Go to Google</button>
      </div>
    );
  }
}

export default Demo;
