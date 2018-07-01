pragma solidity ^0.4.17;
//contract address
//0x1875833e773fa33cf1e65f38d1c0e26ba6b1cbfb

contract BurgerToken {
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function transfer(address _to, uint256 _value) public;
}


contract Exchange {

    uint256 exchangeRate = 100;
    uint256 decimals = 1000000000000000000;
    mapping ( address => uint256 ) public balanceOf;
    address tokenAddress = 0x5c87e1c456dcedfab139df81a7ca331bb0c14dda;

    address ownerOne = 0x7303efC3B94bB9D7D37511303A5108601D9A82FF;
    address ownerTwo = 0xd090c8f4601A1b02F49aFD9825C5f393a89543bE;
    address ownerThree = 0x61CD69d123fe3d89aB7D055B3C6980081F859D2A;

    uint256 public etherBalance = 0;

    function exchange() public payable {
        require(msg.value > 1 ether);
        uint256 toEther = msg.value/(1 ether);
        etherBalance += toEther;
        uint256 etherToBurgerToken = toEther * exchangeRate *  decimals;
        BurgerToken(tokenAddress).transfer(msg.sender, etherToBurgerToken);
        balanceOf[this] -= etherToBurgerToken;

    }

    function deposit(uint256 tokens) public {

        balanceOf[this]+= tokens;
        BurgerToken(tokenAddress).transferFrom(msg.sender, address(this), tokens);
    }

    function withdrawEther(address _to) public {
        require(msg.sender == ownerOne ||
                msg.sender == ownerTwo ||
                msg.sender == ownerThree);
        _to.transfer(this.balance);
        etherBalance = 0;
    }

    function transferBT(address _to, uint256 tokens) public {
        require(msg.sender == ownerOne ||
                msg.sender == ownerTwo ||
                msg.sender == ownerThree);
                uint256 tokensToTransfer = tokens * decimals;
                BurgerToken(tokenAddress).transfer(_to, tokensToTransfer);
                balanceOf[this] -= tokensToTransfer;


    }

}

/**
[
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "etherBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "_to", type: "address" }],
    name: "withdrawEther",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "tokens", type: "uint256" }
    ],
    name: "transferBT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "tokens", type: "uint256" }],
    name: "deposit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "exchange",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  }
];*/
