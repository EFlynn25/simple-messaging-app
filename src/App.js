import React from 'react';
import './App.css';
import Chat from './Chat';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      message: "",
      name: "",
      messages: []
    };

    this.startSocket = this.startSocket.bind(this);
    this.onNameInputChange = this.onNameInputChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);

    this.socket = null;
  }

  componentDidMount() {
    this.startSocket();
  }

  startSocket() {
    this.socket = new WebSocket('ws://192.168.45.2:5000');

    this.socket.onmessage = (event) => {
      console.log("WebSocket message received: ", event);
      const jsonData = JSON.parse(event.data);

      let messages = this.state.messages;
      messages.push({ name: jsonData.name, message: jsonData.message });
      this.setState({ messages: messages });
    };

    this.socket.onopen = (event) => {
      console.log("WebSocket is open now");
      this.setState({ socket: true });
    };

    this.socket.onclose = (event) => {
      console.warn("WebSocket closed, code=" + event.code + " reason=" + event.reason);
      this.setState({ socket: false });
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
      this.setState({ socket: false });
    };

    window.addEventListener("beforeunload", (event) => {
      this.socket.close(1000, "Browser unloading");
    });
  }

  onNameInputChange(event) {
    this.setState({ name: event.target.value });
  }

  sendMessage(message) {
    const messageObj = {name: this.state.name, message: message};
    const jsonString = JSON.stringify(messageObj)
    this.socket.send(jsonString);
  }

  render () {
    let connectionStatus = "Connecting...";
    let spanStyle = {color: "#565656"};
    if (this.state.socket == true) {
      connectionStatus = "Connected"
      spanStyle.color = "#334299";
    } else if (this.state.socket == false) {
      connectionStatus = "Disconnected"
      spanStyle.color = "#bf4040";
    }

    return (
      <div className="App">
        <p>Connection status: <span style={spanStyle}>{ connectionStatus }</span></p>
        <p>Name: <span><input value={this.state.name} onChange={this.onNameInputChange} /></span></p>
        <Chat messages={this.state.messages} sendMessage={this.sendMessage} canSend={this.state.name != ""} />
      </div>
    );
  }
}

export default App;
