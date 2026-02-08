export const wethAbi = [
        {
            "type": "receive",
            "stateMutability": "payable"
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
                    "name": "guy",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "wad",
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
            "name": "deposit",
            "inputs": [],
            "outputs": [],
            "stateMutability": "payable"
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
            "name": "transfer",
            "inputs": [
                {
                    "name": "dst",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "wad",
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
                    "name": "src",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "dst",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "wad",
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
            "name": "withdraw",
            "inputs": [
                {
                    "name": "wad",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "event",
            "name": "Approval",
            "inputs": [
                {
                    "name": "src",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "guy",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "wad",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Deposit",
            "inputs": [
                {
                    "name": "dst",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "wad",
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
                    "name": "src",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "dst",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "wad",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "Withdrawal",
            "inputs": [
                {
                    "name": "src",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "wad",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        }
    ]


export const wethBytecode =
    "0x60c0604052600d60809081526c2bb930b83832b21022ba3432b960991b60a0525f9061002b908261010b565b506040805180820190915260048152630ae8aa8960e31b6020820152600190610054908261010b565b506002805460ff1916601217905534801561006d575f5ffd5b506101c5565b634e487b7160e01b5f52604160045260245ffd5b600181811c9082168061009b57607f821691505b6020821081036100b957634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111561010657805f5260205f20601f840160051c810160208510156100e45750805b601f840160051c820191505b81811015610103575f81556001016100f0565b50505b505050565b81516001600160401b0381111561012457610124610073565b610138816101328454610087565b846100bf565b6020601f82116001811461016a575f83156101535750848201515b5f19600385901b1c1916600184901b178455610103565b5f84815260208120601f198516915b828110156101995787850151825560209485019460019092019101610179565b50848210156101b657868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b6107e5806101d25f395ff3fe608060405260043610610083575f3560e01c806306fdde0314610096578063095ea7b3146100c057806323b872dd146100ef5780632e1a7d4d1461010e578063313ce5671461012d57806370a082311461015857806395d89b4114610191578063a9059cbb146101a5578063d0e30db0146101c4578063dd62ed3e146101cc575f5ffd5b3661009257610090610202565b005b5f5ffd5b3480156100a1575f5ffd5b506100aa61025c565b6040516100b791906105fc565b60405180910390f35b3480156100cb575f5ffd5b506100df6100da36600461064c565b6102e7565b60405190151581526020016100b7565b3480156100fa575f5ffd5b506100df610109366004610674565b610353565b348015610119575f5ffd5b506100906101283660046106ae565b610528565b348015610138575f5ffd5b506002546101469060ff1681565b60405160ff90911681526020016100b7565b348015610163575f5ffd5b506101836101723660046106c5565b60036020525f908152604090205481565b6040519081526020016100b7565b34801561019c575f5ffd5b506100aa6105dc565b3480156101b0575f5ffd5b506100df6101bf36600461064c565b6105e9565b610090610202565b3480156101d7575f5ffd5b506101836101e63660046106de565b600460209081525f928352604080842090915290825290205481565b335f9081526003602052604081208054349290610220908490610723565b909155505060405134815233907fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c9060200160405180910390a2565b5f805461026890610736565b80601f016020809104026020016040519081016040528092919081815260200182805461029490610736565b80156102df5780601f106102b6576101008083540402835291602001916102df565b820191905f5260205f20905b8154815290600101906020018083116102c257829003601f168201915b505050505081565b335f8181526004602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906103419086815260200190565b60405180910390a35060015b92915050565b6001600160a01b0383165f908152600360205260408120548211156103935760405162461bcd60e51b815260040161038a9061076e565b60405180910390fd5b6001600160a01b03841633148015906103cf57506001600160a01b0384165f9081526004602090815260408083203384529091529020545f1914155b15610477576001600160a01b0384165f90815260046020908152604080832033845290915290205482111561043f5760405162461bcd60e51b8152602060048201526016602482015275696e73756666696369656e7420616c6c6f77616e636560501b604482015260640161038a565b6001600160a01b0384165f9081526004602090815260408083203384529091528120805484929061047190849061079c565b90915550505b6001600160a01b0384165f908152600360205260408120805484929061049e90849061079c565b90915550506001600160a01b0383165f90815260036020526040812080548492906104ca908490610723565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161051691815260200190565b60405180910390a35060019392505050565b335f908152600360205260409020548111156105565760405162461bcd60e51b815260040161038a9061076e565b335f908152600360205260408120805483929061057490849061079c565b9091555050604051339082156108fc029083905f818181858888f193505050501580156105a3573d5f5f3e3d5ffd5b5060405181815233907f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b659060200160405180910390a250565b6001805461026890610736565b5f6105f5338484610353565b9392505050565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b80356001600160a01b0381168114610647575f5ffd5b919050565b5f5f6040838503121561065d575f5ffd5b61066683610631565b946020939093013593505050565b5f5f5f60608486031215610686575f5ffd5b61068f84610631565b925061069d60208501610631565b929592945050506040919091013590565b5f602082840312156106be575f5ffd5b5035919050565b5f602082840312156106d5575f5ffd5b6105f582610631565b5f5f604083850312156106ef575f5ffd5b6106f883610631565b915061070660208401610631565b90509250929050565b634e487b7160e01b5f52601160045260245ffd5b8082018082111561034d5761034d61070f565b600181811c9082168061074a57607f821691505b60208210810361076857634e487b7160e01b5f52602260045260245ffd5b50919050565b602080825260149082015273696e73756666696369656e742062616c616e636560601b604082015260600190565b8181038181111561034d5761034d61070f56fea2646970667358221220c1cc57eeb134edbe96bdedb00f94801f14dd3849807f612de78c297cc2f454dd64736f6c634300081e0033" as `0x${string}`