import React, { Component } from 'react';
import Picker from 'emoji-picker-react';
 
class Avatars extends Component {

  selectEmoji = (code, data) => {
    console.log(code);
    console.log(data);
    console.log(data.emoji);
    this.props.updateAvatar(data.emoji);
  }

    render() {
        return (
            <Picker onEmojiClick={this.selectEmoji}/>
        );
    }
}

export default Avatars;


// original thing i used
// import React, {Component} from 'react';
// import Picker from 'emoji-picker-react';

// class Avatars extends Component {

//   selectEmoji = (code, data) => {
//     console.log(code);
//     console.log(data);
//     console.log(data.emoji);
//     this.props.updateAvatar(data.emoji);
//   }

//     render() {
//         return (
//             <Picker onEmojiClick={this.selectEmoji}/>
//         );
//     }
// }

// export default Avatars;



//2nd ONE I DID
// import React, { useState } from 'react';
// import Picker from 'emoji-picker-react';

// const Avatars = (props) => {
//   const [chosenEmoji] = useState(null);

//   return (
//     <div>
//       {chosenEmoji ? (
//         <span>You chose: {chosenEmoji.emoji}</span>
//       ) : (
//         <span>No emoji Chosen</span>
//       )}
//       <Picker onEmojiClick={props.updateAvatar} />
//     </div>
//   );
// };


// const Avatars = (props) => {
//   const [chosenEmoji, setChosenEmoji] = useState(null);
 
//   // const onEmojiClick = (event, emojiObject) => {
//   //   setChosenEmoji(emojiObject);
//   // };

//   const selectEmoji = (code, data) => {
//     //     console.log(code);
//     //     console.log(data);
//     //     console.log(data.emoji);
//         props.updateAvatar(data.emoji);
//       }
 
//   return (
//     <div>
//       {chosenEmoji ? (
//         <span>You chose: {chosenEmoji.emoji}</span>
//       ) : (
//         <span>No emoji Chosen</span>
//       )}
//       <Picker onEmojiClick={this.selectEmoji} />
//     </div>
//   );
// };