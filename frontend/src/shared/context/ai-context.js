import { createContext } from 'react';

export const AIContext = createContext({
    name: '',
    entries: Number(''),
    input: '',
    imageUrl: '',
    celebrityName: '',
    face_hidden: true,

    color_props: [],
    color_hidden: true,
    age: [],
    age_hidden: true,
    box: {},

    saveToDevice: () => {},
    onInputChange: () => {},
    onCelebrityButton: () => {},
    onColorButton: () => {},
    onAgeButton: () => {}
});      