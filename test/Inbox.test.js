//mocha是一个测试框架
//assert是内置在node里的标准库；js运行时，assert用于有关测试的断言
const assert = require("assert");

//作为本地以太坊测试网络
const ganache = require("ganache-cli");

//每当使用web3时，总是需要输入或者导出一个构造函数，用于按照惯例创建web3的实例
const Web3 = require("web3");


//新建一个web3的实例，并告诉实例尝试连接到本地测试网络，该网络是计算机上托管的，仅用于运行测试任务
const web3 = new Web3(ganache.provider());

//将编译后的合约接口和字节码文件导入，类似于从外部库导入合约的做法
const { interface, bytecode } = require ("../compile.js");

let accounts;
let inbox;

beforeEach(async () => {

  //promise 是许诺异步的函数执行，但是目前有了更好的代码重构 await是函数等待，async是标记函数是异步
  // web3.eth.getAccounts().then(fetchedAccounts => {
  //   console.log(fetchedAccounts);
  accounts = await web3.eth.getAccounts();//获得本地测试网络的测试账号

  //新建一个合约实例，分为三个部分
  //第一行新建-传入接口数据 告诉eth要新建合约并要求遵守接口对象，以便通信
  //第二行部署-传入合约字节码和参数， 告诉eth需要创建合约的具体数据并提供构造函数的初始参数
  //第三行发送-创建者地址和gas上限，触发从web3到网络的通信，定义从谁那里创建和燃气的上限
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ["Hi there~"]})
    .send({ from: accounts[0], gas: "1000000"});

});


describe("Inbox", () => {
    it("deploys a contract", () => {
      //断言操作 assert.ok()当括号中的内容存在时返回true 反之false
      assert.ok(inbox.options.address);
    });

    it("has a default message", async () => {
      //虽然是使用的是call() 立即响应，但是这种相对立即响应的 还是需要异步操作。
      //inbox是合约对象，methods是其中的属性，message()是对应函数括号内是传入的参数 call()自定义函数的调用方式
      const message = await inbox.methods.message().call();
      assert.equal(message, "Hi there~");
    });

    it("can change message", async () => {
      //call()获取消息可以定义变量获取数据  send()更改数据可以不定义变量，提前promise事务能够完成，假设不完成会直接报错退出
      await inbox.methods.setMessage("Byebye").send({from: accounts[0]});
      const message = await inbox.methods.message().call();
      assert.equal(message, "Byebye");
    })
});












































// //定义一个新类Car 然后通过简易方法新建两个方法
// class Car {
//   park(){
//     return "stopped";
//   }
//
//   drive(){
//     return "driving";
//   }
// }
//
// //mocha的三大成员 beforeEach describle it
// let car;
// //在每个小模块运行前都要执行beforeEach的语句
// beforeEach(() => {
//   car = new Car();
// });
//
// //describe是一个块，it是最小的执行单位
// describe("Car", () => {
//
//   it("it can park", () => {
//     const car = new Car();
//     assert.equal(car.park(),"stopped");
//   });
//
//   it("it can driving", () => {
//     const car = new Car();
//     assert.equal(car.drive(),"driving");
//   });
// });
