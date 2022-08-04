module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    roots: [
        "<rootDir>/src"
    ],
    testEnvironment: "node",
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    setupFilesAfterEnv: ['./jest.setup.ts']
};