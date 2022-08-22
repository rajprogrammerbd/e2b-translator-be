export interface AddWordsRequestBodyType {
    englishWord: string;
    banglaWords: string[];
    relatedEnglishWords: string[];
}

export interface RemoveWordsRequestBodyType {
    englishWord: string;
}