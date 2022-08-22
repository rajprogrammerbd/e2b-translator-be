import express from 'express';
import wordsServices from '../services/words.service';
import { AddWordsRequestBodyType, RemoveWordsRequestBodyType } from '../utils/types';
import axios from 'axios';

async function addWords(req: express.Request, res: express.Response) {
    const { englishWord, banglaWords, relatedEnglishWords } = req.body as AddWordsRequestBodyType;
    const body = { englishWord, banglaWords, relatedEnglishWords };
    const { LOGIN_ACCESS_COOKIE } = req.cookies;

    axios.defaults.headers.common['Authorization'] = process.env.AUTHORIZATION_CODE as string || '';
    axios.defaults.headers.common['Cookie'] = `LOGIN_ACCESS_COOKIE=${LOGIN_ACCESS_COOKIE}`;

    if ( englishWord !== undefined && banglaWords !== undefined && relatedEnglishWords !== undefined ) {
        
        try {
            const result = await wordsServices.addAWord(body);
            res.send(result);
        } catch (err: any) {
            res.status(500).send({ message: err.message });
        }

    } else res.status(404).send({ message: 'User needs to send all data' });
}

async function deleteWords(req: express.Request, res: express.Response) {
    const { englishWord } = req.body as RemoveWordsRequestBodyType;
    const body = { englishWord };
    const { LOGIN_ACCESS_COOKIE } = req.cookies;

    axios.defaults.headers.common['Authorization'] = process.env.AUTHORIZATION_CODE as string || '';
    axios.defaults.headers.common['Cookie'] = `LOGIN_ACCESS_COOKIE=${LOGIN_ACCESS_COOKIE}`;

    if ( englishWord !== undefined ) {
        try {
            const result = await wordsServices.deleteAWord(body);
            res.send(result);
        } catch (err: any) {
            res.status(500).send({ message: err.message });
        }

    } else res.status(404).send({ message: 'User needs to send all data' });
}

export default {
    addWords,
    deleteWords
};
