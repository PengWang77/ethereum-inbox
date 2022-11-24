//npm install @truffle/hdwallet-provider 已在当前项目文件下载此provider模块
//既能方便部署外部的区块链网络，也能轻松解锁使用的账户
const HDWalletProvider = require("@truffle/hdwallet-provider");

//每当使用web3时，总是需要输入或者导出一个构造函数，用于按照惯例创建web3的实例
const Web3 = require("web3");

//将编译后的合约接口和字节码文件导入，类似于从外部库导入合约的做法
const { interface, bytecode } = require("./compile.js");

//新建对应的provider，在内部输入部署合约的助记码和区块链网络goerli的API
const provider = new HDWalletProvider(
  "crawl miracle corn aunt tissue trust amount liberty wrap weapon acquire peace",
  "https://goerli.infura.io/v3/223dd071502d4a36a14032372ccbac8f"
);

//新建一个web3的实例，并告诉实例尝试连接到goerli网络，该网络是真实的区块链网络
const web3 = new Web3(provider);

//部署操作是异步的，不能直接写await语句，所以创建函数完成此操作
const deploy = async() => {

  //获取助记词对应的所有账户公钥和私钥
  const accounts = await web3.eth.getAccounts();

  //打印第一个账户的信息
  console.log("Attempting to deploy from ", accounts[0]);

  //完成实际的部署操作，首先将接口解析成对象输入进去，以后交互就要遵守对应接口；
  //其次部署进去合约字节码和初始参数，最后通过部署地址和燃气上限触发部署
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode, arguments: ["Hi there~"]})
    .send({from: accounts[0], gas: "1000000"});

  //打印部署的合约地址
  console.log("Contract deployed to ", result.options.address);

  //避免部署任务一直悬挂，加入此次操作关闭provider模块任务
  provider.engine.stop();
}

deploy();
