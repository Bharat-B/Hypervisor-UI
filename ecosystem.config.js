module.exports = {
	apps : [{
		name: "hypervisor-ui",
		cwd: '/usr/local/hypervisor/client',
		script: './node_modules/nuxt/bin/nuxt.js',
		args: 'start'
	}],
};
