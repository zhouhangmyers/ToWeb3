export const erc20Abi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "name",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "symbol",
                "type": "string",
                "internalType": "string"
            },
            {
                "name": "decimals",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "totalSupply",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "allowance",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "approve",
        "inputs": [
            {
                "name": "spender",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "balanceOf",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "decimals",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint8",
                "internalType": "uint8"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "name",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "symbol",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "string",
                "internalType": "string"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "totalSupply",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "transfer",
        "inputs": [
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "transferFrom",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "",
                "type": "bool",
                "internalType": "bool"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "event",
        "name": "Approval",
        "inputs": [
            {
                "name": "owner",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "spender",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "Transfer",
        "inputs": [
            {
                "name": "from",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "to",
                "type": "address",
                "indexed": true,
                "internalType": "address"
            },
            {
                "name": "amount",
                "type": "uint256",
                "indexed": false,
                "internalType": "uint256"
            }
        ],
        "anonymous": false
    }
] as const

export const erc20Bytecode =
    "0x60c060405234801561000f575f5ffd5b5060405161088838038061088883398101604081905261002e91610147565b838383835f61003d858261024e565b50600161004a848261024e565b5060ff821660805260a0819052335f818152600260209081526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050505050505050610308565b634e487b7160e01b5f52604160045260245ffd5b5f82601f8301126100cd575f5ffd5b81516001600160401b038111156100e6576100e66100aa565b604051601f8201601f19908116603f011681016001600160401b0381118282101715610114576101146100aa565b60405281815283820160200185101561012b575f5ffd5b8160208501602083015e5f918101602001919091529392505050565b5f5f5f5f6080858703121561015a575f5ffd5b84516001600160401b0381111561016f575f5ffd5b61017b878288016100be565b602087015190955090506001600160401b03811115610198575f5ffd5b6101a4878288016100be565b935050604085015160ff811681146101ba575f5ffd5b6060959095015193969295505050565b600181811c908216806101de57607f821691505b6020821081036101fc57634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561024957805f5260205f20601f840160051c810160208510156102275750805b601f840160051c820191505b81811015610246575f8155600101610233565b50505b505050565b81516001600160401b03811115610267576102676100aa565b61027b8161027584546101ca565b84610202565b6020601f8211600181146102ad575f83156102965750848201515b5f19600385901b1c1916600184901b178455610246565b5f84815260208120601f198516915b828110156102dc57878501518255602094850194600190920191016102bc565b50848210156102f957868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b60805160a0516105606103285f395f60da01525f61012201526105605ff3fe608060405234801561000f575f5ffd5b5060043610610090575f3560e01c8063313ce56711610063578063313ce5671461011d57806370a082311461015657806395d89b4114610175578063a9059cbb1461017d578063dd62ed3e14610190575f5ffd5b806306fdde0314610094578063095ea7b3146100b257806318160ddd146100d557806323b872dd1461010a575b5f5ffd5b61009c6101ba565b6040516100a991906103d0565b60405180910390f35b6100c56100c0366004610420565b610245565b60405190151581526020016100a9565b6100fc7f000000000000000000000000000000000000000000000000000000000000000081565b6040519081526020016100a9565b6100c5610118366004610448565b6102b1565b6101447f000000000000000000000000000000000000000000000000000000000000000081565b60405160ff90911681526020016100a9565b6100fc610164366004610482565b60026020525f908152604090205481565b61009c610320565b6100c561018b366004610420565b61032d565b6100fc61019e3660046104a2565b600360209081525f928352604080842090915290825290205481565b5f80546101c6906104d3565b80601f01602080910402602001604051908101604052809291908181526020018280546101f2906104d3565b801561023d5780601f106102145761010080835404028352916020019161023d565b820191905f5260205f20905b81548152906001019060200180831161022057829003601f168201915b505050505081565b335f8181526003602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061029f9086815260200190565b60405180910390a35060015b92915050565b6001600160a01b0383165f9081526003602090815260408083203384529091528120545f19811461030a576102e6838261050b565b6001600160a01b0386165f9081526003602090815260408083203384529091529020555b610315858585610342565b506001949350505050565b600180546101c6906104d3565b5f610339338484610342565b50600192915050565b6001600160a01b0383165f908152600260205260408120805483929061036990849061050b565b90915550506001600160a01b038083165f81815260026020526040908190208054850190555190918516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906103c39085815260200190565b60405180910390a3505050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b038116811461041b575f5ffd5b919050565b5f5f60408385031215610431575f5ffd5b61043a83610405565b946020939093013593505050565b5f5f5f6060848603121561045a575f5ffd5b61046384610405565b925061047160208501610405565b929592945050506040919091013590565b5f60208284031215610492575f5ffd5b61049b82610405565b9392505050565b5f5f604083850312156104b3575f5ffd5b6104bc83610405565b91506104ca60208401610405565b90509250929050565b600181811c908216806104e757607f821691505b60208210810361050557634e487b7160e01b5f52602260045260245ffd5b50919050565b818103818111156102ab57634e487b7160e01b5f52601160045260245ffdfea26469706673582212206174233f53219b9f49f2303685c27e7ac2f05845ddb0faddcec49b16695fa4e564736f6c634300081e0033" as `0x${string}`
