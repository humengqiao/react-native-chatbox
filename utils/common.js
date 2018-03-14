import {
    Dimensions,
    PixelRatio,
    ToastAndroid
} from 'react-native';

export function getScreenSize() {
    return {width, height} = Dimensions.get('window')
}

export function getPixel() {
    return 1 / PixelRatio.get()
}
