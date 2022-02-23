import React from 'react';
import './Chat.css';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageInputValue: ""
    };

    this.scrollDown = this.scrollDown.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);

    this.chatMessagesRef = React.createRef();
  }

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate() {
    this.scrollDown();
  }

  scrollDown() {
    if (this.chatMessagesRef.current != null) {
      this.chatMessagesRef.current.scrollTop = this.chatMessagesRef.current.scrollHeight - this.chatMessagesRef.current.clientHeight;
    }
  }

  onInputChange(event) {
    this.setState({ messageInputValue: event.target.value });
  }

  onInputKeyPress(event) {
    let code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      event.stopPropagation();

      this.props.sendMessage(this.state.messageInputValue);
      this.setState({ messageInputValue: "" });
    }
  }

  render () {
    return (
      <div className="Chat">
        <div className="chatHeader">
          <h1>Simple Messaging App</h1>
        </div>
        <div className="chatMessages" ref={this.chatMessagesRef}>
          {
            this.props.messages.map((item, i) => {
              return <p key={i}><span>{item.name}:</span> {item.message}</p>;
            })
          }
          <input
            className="chatMessageInput"
            value={this.state.messageInputValue}
            onChange={this.onInputChange}
            onKeyPress={this.onInputKeyPress}
            disabled={this.props.canSend ? "" : "disabled"}
            placeholder={this.props.canSend ? "Type message here" : "Please enter a name"} />
        </div>
      </div>
    );
  }
}

export default Chat;
