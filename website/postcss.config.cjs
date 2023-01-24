const jit = require('postcss-jit-props');
const OpenProps = require('open-props');

const config = {
	plugins: [jit(OpenProps)],
};

module.exports = config;
