const autoprefixer = require('autoprefixer');
const jit = require('postcss-jit-props');
const OpenProps = require('open-props');

const config = {
	plugins: [jit(OpenProps), autoprefixer],
};

module.exports = config;
