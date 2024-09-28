// jest.config.js
module.exports = {
    silent: false,
    verbose: true,    
    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },

    projects: [
        {
            displayName: 'Unit Tests',
            testMatch: ['<rootDir>/test/unit/**/*.test.js'],
            testEnvironment: 'jsdom',          
        },
        {
            displayName: 'Integration Tests',
            testMatch: ['<rootDir>/test/integration/**/*.test.js'],
            testEnvironment: 'jsdom',            
        }
    ],
};