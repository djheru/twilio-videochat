import React, { Component } from 'react';
import Video from 'twilio-video';
import axios from 'axios';
import { Card, CardText, RaisedButton, TextField } from 'material-ui';

export default class VideoComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      identity: null,
      roomName: '',
      roomNameError: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null
    };
  }

  componentDidMount() {
    axios.get('/token').then((results) => {
      const { identity, token } = results.data;
      this.setState({ identity, token });
    });
  }

  handleRoomNameChange = (e) => {
    let roomName = e.target.value;
    this.setState({ roomName });
  };

  joinRoom = () => {
    if (!this.state.roomName.trim()) {
      this.setState({ roomNameError: true });
      return;
    }

    console.log(`Joining room: ${this.state.roomName}`);
    let connectOptions = {
      name: this.state.roomName
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }

    // Connect to a room, providing the room name and token
    Video
      .connect(this.state.token, connectOptions)
      .then(room => this.roomJoined(room), e => console.log(`Could not connect to video: ${e.message}`));
  };

  leaveRoom = () => {
    this.state.activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  };

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  attachParticipantTracks(participant, container) {
    const tracks = Array.from(participant.tracks.values());
    this.attachTracks(tracks, container);
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

  detachParticipantTracks = (participant) => {
    const tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  };

  roomJoined = (activeRoom) => {
    console.log(`Joined as '${this.state.identity}'`);
    const localMediaAvailable = true;
    const hasJoinedRoom = true;
    this.setState({ activeRoom, localMediaAvailable, hasJoinedRoom });

    const previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(activeRoom.localParticipant, previewContainer);
    }

    // Handle the various room events
    activeRoom.participants.forEach(participant => {
      console.log(`Currently in room: ${participant.identity}`);
      const previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    activeRoom.on('participantConnected', participant => {
      console.log(`New participant connected: ${participant.identity}`);
    });

    activeRoom.on('trackAdded', (track, participant) => {
      console.log(`${participant.identity} added track ${track.kind}`);
      const previewContainer = this.refs.remoteMedia;
      this.attachTracks([track], previewContainer);
    });

    activeRoom.on('trackRemoved', (track, participant) => {
      console.log(`${participant.identity} removed track ${track.kind}`);
      this.detachTracks([track]);
    });

    activeRoom.on('participantDisconnected', participant => {
      console.log(`${participant.identity} left the room`);
      this.detachParticipantTracks(participant)
    });

    activeRoom.on('disconnected', () => {
      const previewTracks = this.state.previewTracks || [];
      previewTracks.forEach(track => {
        track.stop();
      });

      this.detachParticipantTracks(activeRoom.localParticipant);
      activeRoom.participants.forEach(this.detachParticipantTracks);
      this.state.activeRoom = null;
      this.setState({ hasJoinedRoom: false, localMediaAvailable: false, })
    });
  };

  render() {
    // only show video track after user has joined a room
    const showLocalTrack = (this.state.localMediaAvailable) ?
      (<div className="flex-item"><div ref="localMedia"/></div>) : '';

    // display "join room" if not in a room, "leave room" if in a room
    const joinOrLeaveRoomButton = (this.state.hasJoinedRoom) ?
      (<RaisedButton label="Leave Room" secondary={true} onClick={this.leaveRoom}/>) :
      (<RaisedButton label="Join Room" secondary={true} onClick={this.joinRoom}/>);
    return (
      <Card>
        <CardText>
          <div className="flex-container">
            {showLocalTrack}{/* show local track if available */}
            <div className="flex-item">
              <TextField
                hintText="Room Name"
                onChange={this.handleRoomNameChange}
                errorText={(this.state.roomNameError) ? 'Room name is required' : undefined}/>
              <br/>
              {joinOrLeaveRoomButton}
            </div>
            <div className="flex-item" ref="remoteMedia" id="remote-media"/>
          </div>
        </CardText>
      </Card>
    )
  }
}
