import { createContext } from 'react';

export const RecordContext = createContext({
    // 4 Buttons in <CheckRecordsPanel />
    onHomeButton: () => {},
    onCelebrityRecordsButton: () => {},
    userCelebrityRecords: [],
    onColorRecordsButton: () => {},
    userColorRecords: [],
    onAgeRecordsButton: () => {},
    userAgeRecords: [],
    resetState: () => {}
});