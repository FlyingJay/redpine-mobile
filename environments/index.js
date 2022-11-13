var fs = require('fs');
var path = require('path');
(function () {
	var envName = process.argv[2]
	var rootDir = path.join(__dirname, '..');
	console.log(`* setting root dir to ${rootDir}`);
	var envPath = path.join(rootDir, 'environments', `${envName}.js`);
	console.log(`* loading from ${envPath}`);

	console.log('* providing environment to Javascript');
	console.log('==> copying to /environment.js');
	fs.copyFileSync(envPath, './environment.js');
	var env = require(envPath);

	console.log('* providing environment to iOS');
	var iosPath = path.join(rootDir, 'ios', 'redpine', 'env.json');
	console.log(`==> dumping to ${iosPath}`);
	fs.writeFileSync(iosPath, JSON.stringify(env));
})();