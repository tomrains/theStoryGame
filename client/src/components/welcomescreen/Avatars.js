import React, {Component} from 'react';
import EmojiPicker from 'emoji-picker-react';

class Avatars extends Component {

  selectEmoji = (code, data) => {
    console.log(code);
    console.log(data);
    console.log(data.emoji);
    this.props.updateAvatar(data.emoji);
  }

    render() {
        return (
            <EmojiPicker onEmojiClick={this.selectEmoji}/>
        );
    }
}

export default Avatars;
