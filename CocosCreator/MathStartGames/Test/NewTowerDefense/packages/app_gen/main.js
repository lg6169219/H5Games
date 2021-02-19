'use strict';
const Fs = require('fire-fs');
const Path = require('fire-path');
const Async = require('async');
const Del = require('del');

let sharpPath;
if (Editor.dev) {
  sharpPath = 'sharp';
} else {
  sharpPath = Editor.url('unpack://utils/sharp');
}
const Sharp = require(sharpPath);

const dontSelectCorrectAssetMsg = {
  type: 'warning',
  buttons: ['OK'],
  titile: 'Unpack Texture Packer Atlas',
  message: 'Please select a Texture Packer asset at first!',
  defaultId: 0,
  noLink: true
};

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
	'gen_app' () {
		var projectPath = Editor.projectPath;
		if(!projectPath) { // 新版本走这里
			projectPath = Editor.Project.path;
		}
		
		var path = Path.join(projectPath, 'assets/scripts/game');
		// Editor.log(path);
		if (!Fs.existsSync(path)) {
			Fs.mkdirSync(path);
		}
		
		var file_name = Path.join(path, "game_app.js");
		var data = "var game_mgr = require(\"game_mgr\");\n\nvar game_app = cc.Class({\n\textends: game_mgr,\n\n\tstatics: {\n\t\tInstance: null, \n\t},\n\n\tproperties: {\n\t},\n\n\tonLoad() {\n\t\tif (game_app.Instance === null) {\n\t\t\tgame_app.Instance = this;\n\t\t}\n\t\telse {\n\t\t\tcc.error(\"[error]:game_app has multi instances\");\n\t\t\tthis.destroy();\n\t\t\treturn;\n\t\t}\n\t\tgame_mgr.prototype.onLoad.call(this);\n\t},\n\n\tstart() {\n\t},\n\n});";
		if (!Fs.existsSync(file_name)) {
			Fs.writeFileSync(file_name, data);
			Editor.assetdb.refresh('db://assets/scripts/game', () => {
				Editor.success('Gen file: ' + file_name);
			});
		}
		else {
			Editor.log(file_name + " 已经存在");
		}
	},
	
    'gen' () {
		
		Editor.Scene.callSceneScript('app_gen', 'gen_ui', function (err, node_name) {
			if (node_name) {
				var projectPath = Editor.projectPath;
				if(!projectPath) { // 新版本走这里
					projectPath = Editor.Project.path;
				}
				
				var path = Path.join(projectPath, 'assets/scripts/ui_ctrls');
				
				if (!Fs.existsSync(path)) {
					Fs.mkdirSync(path);
				}
				
				var data = "var ui_ctrl = require(\"ui_ctrl\");\nvar ui_manager = require(\"ui_manager\");\n\ncc.Class({\n\textends: ui_ctrl,\n\n\tproperties: {\n\t},\n\n\tonLoad() {\n\t\tui_ctrl.prototype.onLoad.call(this);\n\t},\n\n\tstart() {\n\t},\n\n});";
				
				var file_name = Path.join(path, node_name + "_ctrl" + ".js");
				
				if (!Fs.existsSync(file_name)) {
					Fs.writeFileSync(file_name, data);
					Editor.assetdb.refresh('db://assets/scripts/ui_ctrls', () => {
						Editor.success('Gen file: ' + file_name);
					});
				}
				else {
					Editor.log(file_name + " 已经存在");
				}
			}
			else {
				Editor.log("生成失败，请选择一个UI节点");
			}
		});
    },
  },
};
