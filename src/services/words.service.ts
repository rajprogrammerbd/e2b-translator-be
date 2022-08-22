import { RemoveWordsRequestBodyType } from './../utils/types';
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

interface DeleteResponseType {
    status: boolean;
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

  function deleteAWord(body: RemoveWordsRequestBodyType): Promise<DeleteResponseType | AxiosError> {
    return new Promise(async (resolve, reject) => {
        const { englishWord } = body;

        try {
            const removedWord = await axios.delete<DeleteResponseType>(`${process.env.WORDS_REPO_ACCESS_URL}/api/remove/word`, { data: { englishWord } });

            const resolvedObj: DeleteResponseType = {
                status: removedWord.data?.status
            };

            resolve(resolvedObj);
        } catch (err: any) {
            console.log('error because of rejection ', err);
            reject(err.response.data);
        }
    });
  }
  
  export default {
    deleteAWord,
    addAWord,
  };
  