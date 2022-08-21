require('dotenv').config();
import { AddWordsRequestBodyType } from '../utils/types';
import axios, { AxiosError } from 'axios';

interface ResponseType {
    success: boolean;
    banglaWords: string[];
    englishWord: string;
    relatedEnglishWords: string[];
    user: {
        email: string;
        username: string;
    }
}
  
  function addAWord(body: AddWordsRequestBodyType): Promise<ResponseType | AxiosError> {
    return new Promise(async (resolve, reject) => {
        const { banglaWords, englishWord, relatedEnglishWords } = body;

        try {
            const addWordRes = await axios.post<ResponseType>(`${process.env.WORDS_REPO_ACCESS_URL}/api/add/word`, {
                banglaWords,
                englishWord,
                relatedEnglishWords
            });

            const resolvedObj: ResponseType = {
                success: true,
                banglaWords: addWordRes.data?.banglaWords,
                englishWord: addWordRes.data?.englishWord,
                relatedEnglishWords: addWordRes.data?.relatedEnglishWords,
                user: addWordRes.data?.user
            };

            resolve(resolvedObj);
        } catch (err: any) {
            reject(err.response.data);
        }
    });
  }
  
  export default {
    addAWord,
  };
  