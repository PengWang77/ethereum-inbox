// compile code will go here


//构建一个路径，类似于从当前编译的js文件到内置sol文件的目录路径；通过path模块可以保证跨平台兼容性
const path = require("path");
//文件系统模块
const fs = require("fs");
//solc文件的js处理文件包
const solc = require("solc");

//新建路径：path模块解析从当前路径到内置sol文件路径的经过文件名称
const inboxPath = path.resolve(__dirname, "contracts", "Inbox.sol");
//新建常量：fs文件系统模块通过路径和编码标准，同步读取文件的内容
const source = fs.readFileSync(inboxPath, "utf8");

//solidty的js包通过合约源文件编译产出1份
//添加模块导出语句，确保我们可以简单在编译文件中请求并立即访问编译后的源代码
module.exports = solc.compile(source, 1).contracts[":Inbox"];//不需要编译后的大嵌套文件，只需要编译后文件的inbox内容（“：Inbox”是名称）
