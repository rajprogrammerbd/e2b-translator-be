import homepageService from '../homepage.services';

describe('homepageService', () => {
    const { getHomePage } = homepageService;

    it('getHomePage should return promise', async () => {
        const value = await getHomePage();

        expect(value).toEqual({ message: 'okie' });
    });
});