import { Component } from 'react';
import CurrentSong from '../src/Entity/CurrentSong';

interface IndexProps {
  socket: any;
}

interface IndexState {
  currentSong: CurrentSong | null;
  subscribe: boolean;
  subscribed: boolean;
}

export default class Index extends Component {
  props: IndexProps;

  state: IndexState = {
    currentSong: null,
    subscribe: false,
    subscribed: false,
  };

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      // connect to WS server and listen event
      this.props.socket.on('status.change', this.handleStatusChange);
      this.setState({ subscribed: true });
    }
  };
  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate() {
    this.subscribe();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe) {
      return { subscribe: true };
    }
    return null;
  }

  // close socket connection
  componentWillUnmount() {
    this.props.socket.off('status.change', this.handleStatusChange);
  }

  // add messages from server to the state
  handleStatusChange = currentSong => {
    this.setState({ currentSong: currentSong });
  };

  get status() {
    if (null !== this.state.currentSong) {
      return `${this.state.currentSong.artist} - ${this.state.currentSong.title}`;
    }

    return 'niks ni';
  }

  render() {
    return (
      <main>
        <div>{this.status}</div>
      </main>
    );
  }
}
