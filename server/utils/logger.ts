import tiza from 'tiza';

const prefix = tiza
    .bgColor('green')
    .color('black')
    .text(' EAR ')
    .reset()
    .text(' ').text;

export default function logInfoWithPrefix(info: string) {
    tiza.info(prefix(info));
}
