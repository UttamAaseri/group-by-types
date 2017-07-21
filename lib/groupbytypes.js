const fs = require('fs-extra'),
	async = require('async'),
	path = require('path');

module.exports = function(opt, _cb) {
	this.inputDir = opt.inputDir;
	this.outputDir = opt.outputDir || opt.inputDir;
	this.removeOriginal = opt.removeOriginal || false;
	this.dirs = {};

	if (!opt.inputDir) throw new Error("Please Specify Required Parameters!");
	if (!_cb) _cb = function() {};

	this.start = function() {
		var ME = this;
		fs.readdir(ME.inputDir, (err, files) => {
			if (err) return _cb(err);
			async.eachSeries(files, (fileName, callback) => {
				var taskList = [
					ME.isDirectory(fileName),
					ME.getFileExtension,
					ME.getExtensionFolder(),
					ME.copyFile(),
					ME.removeOriginalFile()
				];
				async.waterfall(taskList, (err, done) => {
					if (err) {
						if (err.message == 'ISDIRECTORY') return callback();
						return callback(err);
					}
					return callback()
				});

			}, (err, done) => {
				if (err) return _cb(err);
				return _cb(null, "success");
			});
		});
	};

	this.isDirectory = function(fileName) {
		var ME = this;
		return function(callback) {
			fs.stat(path.join(ME.inputDir, fileName), (err, stats) => {
				if (err) return callback(err);
				if (stats.isDirectory()) {
					return callback(new Error("ISDIRECTORY"));
				}
				return callback(null, fileName);
			})
		}
	};

	this.getFileExtension = function(fileName, callback) {
		var ext = path.extname(fileName);
		return callback(null, fileName, ext)
	};

	this.getExtensionFolder = function() {
		var ME = this;
		return function(fileName, ext, callback) {
			var ext = ext.replace(".", "");
			if (!ext) ext = "NOEXTENSION";
			if (ME.dirs[ext]) return callback(null, fileName, ME.dirs[ext]);
			var extFolder = path.join(ME.outputDir, ext);
			fs.stat(extFolder, (err, stats) => {
				if (err) {
					if (err.code == "ENOENT") {
						fs.mkdir(extFolder, (err, done) => {
							if (err) return callback(err);
							ME.dirs[ext] = extFolder;
							return callback(null, fileName, extFolder);
						})
					} else {
						return callback(err);
					}
				} else {
					ME.dirs[ext] = extFolder;
					return callback(null, fileName, extFolder);
				}
			})
		}
	};

	this.copyFile = function() {
		var ME = this;
		return function(fileName, extFolder, callback) {
			var source = path.join(ME.inputDir, fileName);
			var target = path.join(extFolder, fileName);
			fs.copy(source, target, err => {
				if (err) return callback(err)
				return callback(null, fileName)
			})
		}
	};

	this.removeOriginalFile = function() {
		var ME = this;
		return function(fileName, callback) {
			if (!ME.removeOriginal) return callback(null, "Done!")
			fs.unlink(path.join(ME.inputDir, fileName), (err, done) => {
				if (err) return callback(err);
				return callback(null, done)
			})
		}
	};

	this.start();
};