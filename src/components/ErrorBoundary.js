import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <span>
          Somthing went worng: <br />
          {this.state.error.toString()}
        </span>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
