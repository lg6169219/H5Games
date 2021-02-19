![image](https://github.com/lg6169219/CocosCreatorProject/blob/master/nodejs_server/nodejs_server_templates/%E5%9F%BA%E4%BA%8Enodejs%E7%9A%84h5%E6%B8%B8%E6%88%8F%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%9E%B6%E6%9E%84.png)
</br>
webserver</br>
上传</br>
下载</br>
获取配置信息</br>
通过web获取信息</br>
web方式接入sdk</br>

gateway 网关服务器</br>
用户长连接接入gateway</br>
gateway连接到</br>
	用户中心服务器</br>
	系统服务</br>
	游戏1服</br>
	游戏2服</br>
	。。。</br>
gateway安全验证、转发请求</br>


用户中心server</br>
用户资料</br>

系统服务server</br>
用户和系统交互</br>


------------------ 公共模块</br>
database数据库</br>
用户数据库</br>
游戏数据库</br>
用户数据redis</br>
游戏数据redis</br>


netbus</br>
TCP websocket JSON、二进制数据格式</br>


-------- 文件目录</br>
apps</br>
	webserver</br>
	gateway</br>
	center_server</br>
	game_server</br>
	system_server</br>

database</br>
	mysql_center.js</br>
	mysql_game.js</br>
	redis_center.js</br>
	redis_game.js</br>
</br>
netbus 为所有长连接服务器所共用;</br>
      支持ws, TCP socket </br>
      二进制协议与json协议;</br>
</br>
utils 存放所有的公共模块</br>
</br>
3rd 存放第三方的js代码库
</br>
node_module 第三方模块
</br>
启动脚本
