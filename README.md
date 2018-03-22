# react-native-chatbox

a multifunctional input box

```
you must place this component last which in a flexbox container
```
<img height="500" src="https://github.com/humengqiao/react-native-chatbox/blob/master/screenshots/Screenshot_2018-03-22-21-13-04-818_com.chatboxdem.png?raw=true">
<img height="500" src="https://github.com/humengqiao/react-native-chatbox/blob/master/screenshots/Screenshot_2018-03-22-21-13-11-349_com.chatboxdem.png?raw=true">
<img height="500" src="https://github.com/humengqiao/react-native-chatbox/blob/master/screenshots/Screenshot_2018-03-22-21-13-16-277_com.chatboxdem.png?raw=true">
<img height="500" src="https://github.com/humengqiao/react-native-chatbox/blob/master/screenshots/Screenshot_2018-03-22-21-13-20-631_com.chatboxdem.png?raw=true">

# Install
```
    npm install react-native-chatbox

    or

    yarn add react-native-chatbox
```

## Demo

```

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Chatbox from 'react-native-chatbox';

export default class App extends Component{
  render() {
    const extras = [
        {
          extraStyle: {

          },
          onExtraClick: () => {console.log('click extra1')},
          icon: require('./images/11.png'),
          extraIconStyle: {
            width: 40,
            height: 40
          },
          textStyle: {
            color: 'red'
          },
          text: 'extra条目1'
        },
        {
          extraStyle: {

          },
          onExtraClick: () => {console.log('click extra2')},
          icon: require('./images/12.png'),
          extraIconStyle: {
              width: 40,
              height: 40
          },
          textStyle: {
              color: 'blue'
          },
          text: 'extra条目2'
        }
    ]

    const emojis = new Map(
        ["grinning", "😀"],
        ["grin", "😁"],
        ["joy", "😂"],
        ["smiley", "😃"],
        ["smile", "😄"],
        ["sweat_smile", "😅"],
        ["laughing", "😆"])

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <Text>Chatbox Component Demo</Text>
        </View>
        <Chatbox
          containerStyle={{

          }}
          extraContainerStyle={{

          }}
          emojiContainerStyle={{

          }}
          onStartRecord={() => {console.log('start record')}}
          onStopRecord={() => {console.log('stop record')}}
          onSendTextMessage={message => {console.log(message)}}
          extras={extras}
          emojis={emojis}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});


```

## Props

<table>
    <tr>
        <th>Prop name</th>
        <th>Desciption</th>
        <th>Type</th>
        <th>Default</th>
    </tr>
    <tr>
        <td>emojis</td>
        <td>render the emoji icon</td>
        <td>PropTypes.Object</td>
        <td></td>
    </tr>
    <tr>
        <td>containerStyle</td>
        <td>chatbox container style</td>
        <td>ViewPropTypes.style</td>
        <td>{}</td>
    </tr>
    <tr>
        <td>extraContainerStyle</td>
        <td>extra panel container style</td>
        <td>ViewPropTypes.style</td>
        <td>{}</td>
    </tr>
    <tr>
        <td>emojiContainerStyle</td>
        <td>emoji panel container style</td>
        <td>ViewPropTypes.style</td>
        <td>{}</td>
    </tr>
    <tr>
        <td>onStartRecord</td>
        <td>record start call the function</td>
        <td>PropTypes.func.isRequired</td>
        <td></td>
    </tr>
    <tr>
        <td>onStopRecord</td>
        <td>record stop call the function</td>
        <td>PropTypes.func.isRequired</td>
        <td></td>
    </tr>
    <tr>
        <td>onSendTextMessage</td>
        <td>click send button call the function(pattern: message => {})</td>
        <td>PropTypes.func.isRequired</td>
        <td></td>
    </tr>
    <tr>
        <td>extras</td>
        <td>pass this props will expand when you toggle the extra button</td>
        <td>PropTypes.array(PropTypes.object)</td>
        <td>[]</td>
    </tr>
</table>

```
    extras param pattern:
        [
            {
              extraStyle: {

              },
              onExtraClick: () => {console.log('click extra1')},
              icon: require('./images/11.png'),
              extraIconStyle: {
                width: 40,
                height: 40
              },
              textStyle: {
                color: 'red'
              },
              text: 'extra条目1'
            }
        ]
```

