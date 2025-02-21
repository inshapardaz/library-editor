import { describe, it, expect } from '@jest/globals';
import LanguageService from './language.service';

describe('LanguageService autoCorrect', () => {
    it('should return the original text if autoCorrectList is not provided', () => {
        const service = new LanguageService({ language: 'en' });
        const text = 'This is a test';
        expect(service.autoCorrect(text)).toBe(text);
    });

    it('should throw an error if autoCorrectList is not an array', () => {
        const service = new LanguageService({ language: 'en', autoCorrectList: 'not an array' });
        const text = 'This is a test';
        expect(() => service.autoCorrect(text)).toThrow('Invalid input: autoCorrectList must be an array of objects.');
    });

    it('should throw an error if autoCorrectList contains invalid objects', () => {
        const service = new LanguageService({
            language: 'en',
            autoCorrectList: [{ incorrectText: 'teh', correctText: 'the', completeWord: 'not a boolean' }]
        });
        const text = 'This is a test';
        expect(() => service.autoCorrect(text)).toThrow("Each object in replacementsList must have 'incorrectText' (string), 'correctText' (string), and 'wholeWord' (boolean).");
    });

    it('should replace text based on autoCorrectList', () => {
        const service = new LanguageService({
            language: 'en',
            autoCorrectList: [
                { incorrectText: 'teh', correctText: 'the', completeWord: false },
                { incorrectText: 'recieve', correctText: 'receive', completeWord: false }
            ]
        });
        const text = 'I recieve teh message';
        const expected = 'I receive the message';
        expect(service.autoCorrect(text)).toBe(expected);
    });

    it('should replace whole words based on autoCorrectList', () => {
        const service = new LanguageService({
            language: 'en',
            autoCorrectList: [
                { incorrectText: 'teh', correctText: 'the', completeWord: true },
                { incorrectText: 'recieve', correctText: 'receive', completeWord: true }
            ]
        });
        const text = 'I recieve teh message';
        const expected = 'I recieve the message';
        expect(service.autoCorrect(text)).toBe(expected);
    });
});