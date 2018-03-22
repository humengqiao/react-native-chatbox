import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    TouchableHighlight,
    ScrollView,
    Keyboard,
    LayoutAnimation,
    UIManager,
    PermissionsAndroid,
    Platform,
    Alert,
    ViewPropTypes
} from 'react-native';
import {getScreenSize, getPixel} from './utils/common';
import emoji from './config/emoji';
const EXPAND_PANEL_HEIGHT = 150;
const INPUT_HEIGHT = 30;
const MAX_INPUT_HEIGHT = 200;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class ChatBox extends Component {
    constructor(props) {
        super(props)
        this.emojis = this.formatEmojiArr(this.props.emojis || emoji)
        this.state = {
            showRecord: true,
            showEmoji: false,
            showExtra: false,
            sendText: '',
            panelHeight: 0,
            inputHeight: INPUT_HEIGHT,
            hasPermission: false
        }
    }

    static propTypes = {
        emojis: PropTypes.object,
        containerStyle: ViewPropTypes.style,
        extraContainerStyle: ViewPropTypes.style,
        emojiContainerStyle: ViewPropTypes.style,
        onStartRecord: PropTypes.func.isRequired,
        onStopRecord: PropTypes.func.isRequired,
        onSendTextMessage: PropTypes.func.isRequired,
        extras: PropTypes.arrayOf(PropTypes.object)
    }

    static defaultProps = {
        containerStyle: {},
        extraContainerStyle: {},
        emojiContainerStyle: {},
        extras: []
    }

    componentWillMount() {
        this.checkPermission()
            .then(hasPermission => {
                this.setState({hasPermission})
                if (!hasPermission) return
            })
    }

    async checkPermission() {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true)
        }

        const rationale = {
            title: '获取录音权限',
            message: '正请求获取麦克风权限用于录音'
        }

        try {
            const checkPermissonResult  = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
            if(!checkPermissonResult) {
                const grantPermissionResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
                return (grantPermissionResult === true || PermissionsAndroid.RESULTS.GRANTED)
            }else {
                return true
            }
        }catch(error) {
            Alert.alert(error)
        }
    }

    async startRecord() {
        if(!this.state.hasPermission) {
            alert('没有录音权限，请在设置打开')
            return
        }

        this.props.onStartRecord()
    }

    async stopRecord() {
        this.props.onStopRecord()
    }

    formatEmojiArr(emojiMap) {
        const size = 27
        const srcArr = [], disArr = []
        emojiMap.forEach(v => srcArr.push(v))
        for (let i = 0; i < srcArr.length; i += size) {
            const emojis = srcArr.slice(i, i + size)
            disArr.push(emojis)
        }
        return disArr
    }

    onPickEmoji(emoji) {
        const sendText = this.state.sendText + emoji
        this.setState({sendText})
    }

    renderLeft() {
        return (
            this.state.showRecord ?
                <TouchableOpacity onPress={() => this.setState({showRecord: false, panelHeight: 0, showEmoji: false, showExtra: false})}>
                    <Image
                        source={require('./images/record.png')}
                        style={styles.icon}/>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => {
                    this.setState({showRecord: true})
                    setTimeout(() => {
                        this.input.focus()
                    })
                }}>
                    <Image
                        source={require('./images/keyboard.png')}
                        style={styles.icon}/>
                </TouchableOpacity>
        )
    }

    renderCenter() {
        return (
            this.state.showRecord ?
                <TextInput
                    ref={el => this.input = el}
                    style={[styles.input, {height: this.state.inputHeight}]}
                    multiline={true}
                    value={this.state.sendText}
                    blurOnSubmit={false}
                    numberOfLines={5}
                    onContentSizeChange={event => {
                        const height = event.nativeEvent.contentSize.height
                        if(height > this.state.inputHeight && height < MAX_INPUT_HEIGHT) {
                            this.setState({
                                inputHeight: height
                            })
                        }else if(height < INPUT_HEIGHT){
                            this.setState({
                                inputHeight: INPUT_HEIGHT
                            })
                        }
                    }}
                    underlineColorAndroid='transparent'
                    onFocus={() => {
                        LayoutAnimation.configureNext({
                            duration: 500,
                            update: {
                                type: LayoutAnimation.Types.spring
                            }
                        })
                        setTimeout(() => {
                            this.setState({panelHeight: 0, showEmoji: false, showRecord: true, showExtra: false})
                        })
                    }}
                    onChangeText={value => this.setState({sendText: value})}/>
                :
                <TouchableHighlight
                    style={styles.recordButton}
                    delayPressIn={10}
                    onPressIn={() => this.startRecord()}
                    onPressOut={() => this.stopRecord()}>
                    <Text style={{fontSize: 16, color: '#fff'}}>按住录音</Text>
                </TouchableHighlight>
        )
    }

    renderRight() {
        return (
            <View style={styles.rightWrapper}>
                {
                    !this.state.showEmoji ?
                        <TouchableOpacity onPress={() => {
                            setTimeout(() => {
                                LayoutAnimation.configureNext({
                                    duration: 500,
                                    update: {
                                        type: LayoutAnimation.Types.spring
                                    }
                                })
                                this.setState({panelHeight: EXPAND_PANEL_HEIGHT, showEmoji: true, showRecord: true, showExtra: false})
                            }, 500)
                            Keyboard.dismiss()
                        }}>
                            <Image
                                source={require('./images/emotion.png')}
                                style={[styles.icon, {marginRight: 5}]}/>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => {
                            LayoutAnimation.configureNext({
                                duration: 500,
                                update: {
                                    type: LayoutAnimation.Types.spring
                                }
                            })
                            this.setState({panelHeight: 0, showEmoji: false, showExtra: false})
                        }}>
                            <Image
                                source={require('./images/keyboard.png')}
                                style={[styles.icon, {marginRight: 5}]}/>
                        </TouchableOpacity>
                }
                {
                    this.state.sendText === '' ?
                        <TouchableOpacity
                            onPress={() => {
                                setTimeout(() => {
                                    LayoutAnimation.configureNext({
                                        duration: 500,
                                        update: {
                                            type: LayoutAnimation.Types.spring
                                        }
                                    })
                                    this.setState({panelHeight: EXPAND_PANEL_HEIGHT, showEmoji: false, showExtra: !this.state.showExtra})
                                }, 500)
                                Keyboard.dismiss()
                            }}>
                            <Image
                                source={require('./images/add.png')}
                                style={styles.icon}/>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={() => {
                                this.setState({sendText: ''})
                                this.props.onSendTextMessage(this.state.sendText)
                            }}>
                            <Text style={{color: '#fff', fontSize: 14}}>发送</Text>
                        </TouchableOpacity>
                }
            </View>
        )
    }

    renderEmojiContent() {
        return this.emojis.map((pageData, pageNum) => {
            return (
                <View
                    style={styles.page}
                    key={pageNum}>
                    {pageData.map((emoji, index) => this.renderEmojiItem(emoji, index))}
                    {this.renderSwitchMenu(pageNum)}
                </View>
            )
        })
    }

    renderSwitchMenu(index) {
        const pages = this.emojis.length
        const menuWidth = 6 * pages + 8 * ( pages - 1)
        const menuStyle = {
            left: (getScreenSize().width - menuWidth) / 2,
            width: menuWidth
        }
        let items = []

        for (let i = 0; i < pages; i++) {
            const itemStyle = i === index ? styles.switchItemCrt : styles.switchItemGrey
            items.push(
                <View style={[styles.switchItem, itemStyle]} key={i}></View>
            )
        }
        return <View style={[styles.switchMenu, menuStyle]}>{items}</View>
    }

    renderEmojiItem(emoji, key) {
        return (
            <TouchableOpacity
                style={styles.btn}
                key={key}
                onPress={() => this.onPickEmoji(emoji)}>
                <Text
                    style={styles.emoji}
                    allowFontScaling={false}>
                    {emoji}
                </Text>
            </TouchableOpacity>
        )
    }

    renderEmoji() {
        return (
            this.state.showEmoji ?
                <View style={[{height: EXPAND_PANEL_HEIGHT}, this.props.emojiContainerStyle]}>
                    <ScrollView
                        style={[styles.emojiPanel, {height: this.state.panelHeight}]}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}>
                        {
                            this.renderEmojiContent()
                        }
                    </ScrollView>
                </View>
                :
                null
        )
    }

    renderExtraItem() {
        const extraViews = this.props.extras.map((item, index) => (
            <TouchableOpacity
                style={[styles.extraItemWrapper, item.extraStyle]}
                onPress={() => item.onExtraClick()}
                key={index}>
                <Image
                    source={item.icon}
                    style={[styles.extraIcon, item.extraIconStyle]}/>
                <Text style={item.textStyle}>{item.text}</Text>
            </TouchableOpacity>
        ))
        return extraViews
    }

    renderExtra() {
        return (
            this.state.showExtra ?
                <View style={[{height: EXPAND_PANEL_HEIGHT}, this.props.extraContainerStyle]}>
                    <ScrollView
                        contentContainerStyle={styles.extraWrapper}
                        horizontal={true}>
                        {

                            this.props.extras && this.props.extras.length > 0 ?
                                this.renderExtraItem()
                                :
                                null
                        }
                    </ScrollView>
                </View>
                :
                null
        )
    }

    render() {
        return (
            <View>
                <View style={[styles.container, {height: this.state.inputHeight + 10}, this.props.containerStyle]}>
                    {
                        this.renderLeft()
                    }
                    {
                        this.renderCenter()
                    }
                    {
                        this.renderRight()
                    }
                </View>
                {
                    this.renderEmoji()
                }
                {
                    this.renderExtra()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderTopWidth: getPixel() * 2,
        borderTopColor: '#999',
        paddingHorizontal: 10
    },
    icon: {
        width: 30,
        height: 30
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 3,
        padding: 0,
        paddingLeft: 5,
        marginHorizontal: 5,
        borderColor: '#999',
        borderWidth: getPixel() * 2
    },
    recordButton: {
        flex: 1,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 3,
        borderWidth: getPixel() * 2,
        borderColor: '#000'
    },
    rightWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    page: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 20,
        paddingHorizontal: 26,
        width: getScreenSize().width,
        height: 160,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        width: Math.floor((getScreenSize().width - 52) / 9) - 1,
        height: 30,
    },
    emojiPanel: {
        width: getScreenSize().width
    },
    emoji: {
        fontSize: 22
    },
    switchMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        height: 6
    },
    switchItem: {
        width: 6,
        height: 6,
        borderRadius: 3
    },
    switchItemCrt: {
        backgroundColor: '#666'
    },
    switchItemGrey: {
        backgroundColor: '#ccc'
    },
    sendButton: {
        width: 40,
        height: 30,
        borderWidth: getPixel() * 2,
        borderColor: '#000',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#999'
    },
    extraWrapper: {
        paddingTop: 10,
        paddingLeft: 10
    },
    extraItemWrapper: {
        marginRight: 10,
        alignItems: 'center'
    },
    extraIcon: {
        width: 60,
        height: 60
    }
})
