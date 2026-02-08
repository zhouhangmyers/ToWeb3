export const uniswapV2RouterAbi = [
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "_factory",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "_WETH",
                "type": "address",
                "internalType": "address payable"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "receive",
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "WETH",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address payable"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "addLiquidity",
        "inputs": [
            {
                "name": "tokenA",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenB",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amountADesired",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountBDesired",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountAMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountBMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountA",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountB",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "addLiquidityETH",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "amountTokenDesired",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountTokenMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETHMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETH",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "factory",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getAmountIn",
        "inputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "reserveIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "reserveOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "getAmountOut",
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "reserveIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "reserveOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "getAmountsIn",
        "inputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "getAmountsOut",
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "quote",
        "inputs": [
            {
                "name": "amountA",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "reserveA",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "reserveB",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountB",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "pure"
    },
    {
        "type": "function",
        "name": "removeLiquidity",
        "inputs": [
            {
                "name": "tokenA",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenB",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountAMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountBMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountA",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountB",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityETH",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountTokenMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETHMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETH",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountTokenMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETHMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountETH",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityETHWithPermit",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountTokenMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETHMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "approveMax",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "amountToken",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETH",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityETHWithPermitSupportingFeeOnTransferTokens",
        "inputs": [
            {
                "name": "token",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountTokenMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountETHMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "approveMax",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "amountETH",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityWithPermit",
        "inputs": [
            {
                "name": "tokenA",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "tokenB",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "liquidity",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountAMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountBMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "approveMax",
                "type": "bool",
                "internalType": "bool"
            },
            {
                "name": "v",
                "type": "uint8",
                "internalType": "uint8"
            },
            {
                "name": "r",
                "type": "bytes32",
                "internalType": "bytes32"
            },
            {
                "name": "s",
                "type": "bytes32",
                "internalType": "bytes32"
            }
        ],
        "outputs": [
            {
                "name": "amountA",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountB",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapETHForExactTokens",
        "inputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapExactETHForTokens",
        "inputs": [
            {
                "name": "amountOutMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
        "inputs": [
            {
                "name": "amountOutMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapExactTokensForETH",
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountOutMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountOutMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapExactTokensForTokens",
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountOutMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
        "inputs": [
            {
                "name": "amountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountOutMin",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapTokensForExactETH",
        "inputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountInMax",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "swapTokensForExactTokens",
        "inputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountInMax",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "path",
                "type": "address[]",
                "internalType": "address[]"
            },
            {
                "name": "to",
                "type": "address",
                "internalType": "address"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amounts",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "error",
        "name": "SafeERC20FailedOperation",
        "inputs": [
            {
                "name": "",
                "type": "address",
                "internalType": "address"
            }
        ]
    }
]

export const uniswapV2Bytecode = "0x60c060405234801561000f575f5ffd5b5060405161614d38038061614d83398101604081905261002e9161005c565b6001600160a01b039182166080521660a052610094565b6001600160a01b0381168114610059575f5ffd5b50565b5f5f6040838503121561006d575f5ffd5b825161007881610045565b602084015190925061008981610045565b809150509250929050565b60805160a051615f2c6102215f395f818161012d0152818161032d015281816104cf0152818161051e015281816105d4015281816107f201528181610b1a01528181610c5201528181610f930152818161107501528181611121015281816111af015281816112cb015281816113540152818161157d01528181611638015281816116c40152818161173f015281816117af01528181611bc701528181611dac01528181611e0101528181611e3501528181611eb701528181611ff901528181612108015261219101525f81816103dd0152818161065001528181610720015281816108d30152818161090a015281816109fa01528181610b9601528181610c3001528181610d5f0152818161122901528181611386015281816114b6015281816117e1015281816119de01528181611b7701528181611ba501528181611cc401528181611ddf01528181612073015281816121c3015281816127b10152818161280101528181612a5501528181612bf301528181612f1601528181612fb901526130390152615f2c5ff3fe60806040526004361061011d575f3560e01c806302751cec14610160578063054d50d41461019957806318cbafe5146101c65780631f00ca74146101f25780632195995c1461021157806338ed1739146102305780634a25d94a1461024f5780635b0d59841461026e5780635c11d7951461028d578063791ac947146102ac5780637ff36ab5146102cb57806385f8c259146102de5780638803dbee146102fd578063ad5c46481461031c578063ad615dec1461035c578063af2979eb1461037b578063b6f9de951461039a578063baa2abde146103ad578063c45a0155146103cc578063d06ca61f146103ff578063ded9382a1461041e578063e8e337001461043d578063f305d71914610477578063fb3bdb411461048a575f5ffd5b3661015c57336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461015a5761015a613248565b005b5f5ffd5b34801561016b575f5ffd5b5061017f61017a366004613283565b61049d565b604080519283526020830191909152015b60405180910390f35b3480156101a4575f5ffd5b506101b86101b33660046132dd565b610593565b604051908152602001610190565b3480156101d1575f5ffd5b506101e56101e0366004613346565b6105a7565b60405161019091906133b3565b3480156101fd575f5ffd5b506101e561020c366004613409565b6108cc565b34801561021c575f5ffd5b5061017f61022b3660046134fc565b610902565b34801561023b575f5ffd5b506101e561024a366004613346565b6109d2565b34801561025a575f5ffd5b506101e5610269366004613346565b610aed565b348015610279575f5ffd5b506101b86102883660046135a4565b610c29565b348015610298575f5ffd5b5061015a6102a7366004613346565b610d0e565b3480156102b7575f5ffd5b5061015a6102c6366004613346565b610f68565b6101e56102d9366004613637565b61118a565b3480156102e9575f5ffd5b506101b86102f83660046132dd565b611482565b348015610308575f5ffd5b506101e5610317366004613346565b61148e565b348015610327575f5ffd5b5061034f7f000000000000000000000000000000000000000000000000000000000000000081565b6040516101909190613698565b348015610367575f5ffd5b506101b86103763660046132dd565b611549565b348015610386575f5ffd5b506101b8610395366004613283565b611555565b61015a6103a8366004613637565b6116a1565b3480156103b8575f5ffd5b5061017f6103c73660046136ac565b6119b5565b3480156103d7575f5ffd5b5061034f7f000000000000000000000000000000000000000000000000000000000000000081565b34801561040a575f5ffd5b506101e5610419366004613409565b611b70565b348015610429575f5ffd5b5061017f6104383660046135a4565b611b9d565b348015610448575f5ffd5b5061045c61045736600461371a565b611c87565b60408051938452602084019290925290820152606001610190565b61045c610485366004613283565b611d82565b6101e5610498366004613637565b611fd4565b5f5f82428110156104c95760405162461bcd60e51b81526004016104c090613791565b60405180910390fd5b6104f8897f00000000000000000000000000000000000000000000000000000000000000008a8a8a308a6119b5565b90935091506105088986856122ff565b604051632e1a7d4d60e01b8152600481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d906024015f604051808303815f87803b158015610567575f5ffd5b505af1158015610579573d5f5f3e3d5ffd5b50505050610587858361235c565b50965096945050505050565b5f61059f8484846123aa565b949350505050565b606081428110156105ca5760405162461bcd60e51b81526004016104c090613791565b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001686866106016001826137d6565b818110610610576106106137e9565b905060200201602081019061062591906137fd565b6001600160a01b03161461064b5760405162461bcd60e51b81526004016104c09061381f565b6106a87f0000000000000000000000000000000000000000000000000000000000000000898888808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525061248292505050565b91508682600184516106ba91906137d6565b815181106106ca576106ca6137e9565b602002602001015110156106f05760405162461bcd60e51b81526004016104c090613855565b6107b286865f818110610705576107056137e9565b905060200201602081019061071a91906137fd565b336107937f00000000000000000000000000000000000000000000000000000000000000008a8a5f818110610751576107516137e9565b905060200201602081019061076691906137fd565b8b8b6001818110610779576107796137e9565b905060200201602081019061078e91906137fd565b6125cd565b855f815181106107a5576107a56137e9565b60200260200101516126a8565b6107f0828787808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152503092506126d6915050565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316632e1a7d4d836001855161082e91906137d6565b8151811061083e5761083e6137e9565b60200260200101516040518263ffffffff1660e01b815260040161086491815260200190565b5f604051808303815f87803b15801561087b575f5ffd5b505af115801561088d573d5f5f3e3d5ffd5b505050506108c18483600185516108a491906137d6565b815181106108b4576108b46137e9565b602002602001015161235c565b509695505050505050565b60606108f97f00000000000000000000000000000000000000000000000000000000000000008484612896565b90505b92915050565b5f5f5f6109307f00000000000000000000000000000000000000000000000000000000000000008f8f6125cd565b90505f8761093e578c610941565b5f195b60405163d505accf60e01b81529091506001600160a01b0383169063d505accf9061097c903390309086908f908e908e908e9060040161389f565b5f604051808303815f87803b158015610993575f5ffd5b505af11580156109a5573d5f5f3e3d5ffd5b505050506109b88f8f8f8f8f8f8f6119b5565b809450819550505050509b509b9950505050505050505050565b606081428110156109f55760405162461bcd60e51b81526004016104c090613791565b610a527f0000000000000000000000000000000000000000000000000000000000000000898888808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525061248292505050565b9150868260018451610a6491906137d6565b81518110610a7457610a746137e9565b60200260200101511015610a9a5760405162461bcd60e51b81526004016104c090613855565b610aaf86865f818110610705576107056137e9565b6108c1828787808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152508992506126d6915050565b60608142811015610b105760405162461bcd60e51b81526004016104c090613791565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168686610b476001826137d6565b818110610b5657610b566137e9565b9050602002016020810190610b6b91906137fd565b6001600160a01b031614610b915760405162461bcd60e51b81526004016104c09061381f565b610bee7f0000000000000000000000000000000000000000000000000000000000000000898888808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525061289692505050565b915086825f81518110610c0357610c036137e9565b602002602001015111156106f05760405162461bcd60e51b81526004016104c0906138e0565b5f5f610c767f00000000000000000000000000000000000000000000000000000000000000008d7f00000000000000000000000000000000000000000000000000000000000000006125cd565b90505f86610c84578b610c87565b5f195b60405163d505accf60e01b81529091506001600160a01b0383169063d505accf90610cc2903390309086908e908d908d908d9060040161389f565b5f604051808303815f87803b158015610cd9575f5ffd5b505af1158015610ceb573d5f5f3e3d5ffd5b50505050610cfd8d8d8d8d8d8d611555565b9d9c50505050505050505050505050565b8042811015610d2f5760405162461bcd60e51b81526004016104c090613791565b610dbe85855f818110610d4457610d446137e9565b9050602002016020810190610d5991906137fd565b33610db87f000000000000000000000000000000000000000000000000000000000000000089895f818110610d9057610d906137e9565b9050602002016020810190610da591906137fd565b8a8a6001818110610779576107796137e9565b8a6126a8565b5f8585610dcc6001826137d6565b818110610ddb57610ddb6137e9565b9050602002016020810190610df091906137fd565b6001600160a01b03166370a08231856040518263ffffffff1660e01b8152600401610e1b9190613698565b602060405180830381865afa158015610e36573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e5a9190613926565b9050610e998686808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152508892506129e4915050565b86818787610ea86001826137d6565b818110610eb757610eb76137e9565b9050602002016020810190610ecc91906137fd565b6001600160a01b03166370a08231876040518263ffffffff1660e01b8152600401610ef79190613698565b602060405180830381865afa158015610f12573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610f369190613926565b610f4091906137d6565b1015610f5e5760405162461bcd60e51b81526004016104c090613855565b5050505050505050565b8042811015610f895760405162461bcd60e51b81526004016104c090613791565b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168585610fc06001826137d6565b818110610fcf57610fcf6137e9565b9050602002016020810190610fe491906137fd565b6001600160a01b03161461100a5760405162461bcd60e51b81526004016104c09061381f565b61101f85855f818110610d4457610d446137e9565b61105c8585808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152503092506129e4915050565b6040516370a0823160e01b81525f906001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906370a08231906110aa903090600401613698565b602060405180830381865afa1580156110c5573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906110e99190613926565b90508681101561110b5760405162461bcd60e51b81526004016104c090613855565b604051632e1a7d4d60e01b8152600481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d906024015f604051808303815f87803b15801561116a575f5ffd5b505af115801561117c573d5f5f3e3d5ffd5b50505050610f5e848261235c565b606081428110156111ad5760405162461bcd60e51b81526004016104c090613791565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031686865f8181106111e9576111e96137e9565b90506020020160208101906111fe91906137fd565b6001600160a01b0316146112245760405162461bcd60e51b81526004016104c09061381f565b6112817f0000000000000000000000000000000000000000000000000000000000000000348888808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525061248292505050565b915086826001845161129391906137d6565b815181106112a3576112a36137e9565b602002602001015110156112c95760405162461bcd60e51b81526004016104c090613855565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0835f8151811061130a5761130a6137e9565b60200260200101516040518263ffffffff1660e01b81526004015f604051808303818588803b15801561133b575f5ffd5b505af115801561134d573d5f5f3e3d5ffd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb6113b77f000000000000000000000000000000000000000000000000000000000000000089895f818110610d9057610d906137e9565b845f815181106113c9576113c96137e9565b60200260200101516040518363ffffffff1660e01b81526004016113ee92919061393d565b6020604051808303815f875af115801561140a573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061142e9190613956565b61143a5761143a613248565b611478828787808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152508992506126d6915050565b5095945050505050565b5f61059f848484612c94565b606081428110156114b15760405162461bcd60e51b81526004016104c090613791565b61150e7f0000000000000000000000000000000000000000000000000000000000000000898888808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525061289692505050565b915086825f81518110611523576115236137e9565b60200260200101511115610a9a5760405162461bcd60e51b81526004016104c0906138e0565b5f61059f848484612d72565b5f81428110156115775760405162461bcd60e51b81526004016104c090613791565b6115a6887f000000000000000000000000000000000000000000000000000000000000000089898930896119b5565b6040516370a0823160e01b81529093506116229150899086906001600160a01b038316906370a08231906115de903090600401613698565b602060405180830381865afa1580156115f9573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061161d9190613926565b6122ff565b604051632e1a7d4d60e01b8152600481018390527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690632e1a7d4d906024015f604051808303815f87803b158015611681575f5ffd5b505af1158015611693573d5f5f3e3d5ffd5b505050506108c1848361235c565b80428110156116c25760405162461bcd60e51b81526004016104c090613791565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031685855f8181106116fe576116fe6137e9565b905060200201602081019061171391906137fd565b6001600160a01b0316146117395760405162461bcd60e51b81526004016104c09061381f565b5f3490507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004015f604051808303818588803b158015611796575f5ffd5b505af11580156117a8573d5f5f3e3d5ffd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb6118127f000000000000000000000000000000000000000000000000000000000000000089895f818110610d9057610d906137e9565b836040518363ffffffff1660e01b815260040161183092919061393d565b6020604051808303815f875af115801561184c573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906118709190613956565b61187c5761187c613248565b5f868661188a6001826137d6565b818110611899576118996137e9565b90506020020160208101906118ae91906137fd565b6001600160a01b03166370a08231866040518263ffffffff1660e01b81526004016118d99190613698565b602060405180830381865afa1580156118f4573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906119189190613926565b90506119578787808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152508992506129e4915050565b878188886119666001826137d6565b818110611975576119756137e9565b905060200201602081019061198a91906137fd565b6001600160a01b03166370a08231886040518263ffffffff1660e01b8152600401610ef79190613698565b5f5f82428110156119d85760405162461bcd60e51b81526004016104c090613791565b5f611a047f00000000000000000000000000000000000000000000000000000000000000008c8c6125cd565b6040516323b872dd60e01b81529091506001600160a01b038216906323b872dd90611a3790339085908e90600401613971565b6020604051808303815f875af1158015611a53573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611a779190613956565b505f5f826001600160a01b03166389afcb44896040518263ffffffff1660e01b8152600401611aa69190613698565b60408051808303815f875af1158015611ac1573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611ae59190613995565b915091505f611af48e8e612e0d565b5090508d6001600160a01b0316816001600160a01b031614611b17578183611b1a565b82825b90975095508a871015611b3f5760405162461bcd60e51b81526004016104c0906139b7565b89861015611b5f5760405162461bcd60e51b81526004016104c0906139fc565b505050505097509795505050505050565b60606108f97f00000000000000000000000000000000000000000000000000000000000000008484612482565b5f5f5f611beb7f00000000000000000000000000000000000000000000000000000000000000008e7f00000000000000000000000000000000000000000000000000000000000000006125cd565b90505f87611bf9578c611bfc565b5f195b60405163d505accf60e01b81529091506001600160a01b0383169063d505accf90611c37903390309086908f908e908e908e9060040161389f565b5f604051808303815f87803b158015611c4e575f5ffd5b505af1158015611c60573d5f5f3e3d5ffd5b50505050611c728e8e8e8e8e8e61049d565b909f909e509c50505050505050505050505050565b5f5f5f8342811015611cab5760405162461bcd60e51b81526004016104c090613791565b611cb98c8c8c8c8c8c612f01565b90945092505f611cea7f00000000000000000000000000000000000000000000000000000000000000008e8e6125cd565b9050611cf88d3383886126a8565b611d048c3383876126a8565b6040516335313c2160e11b81526001600160a01b03821690636a62784290611d30908a90600401613698565b6020604051808303815f875af1158015611d4c573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611d709190613926565b92505050985098509895505050505050565b5f5f5f8342811015611da65760405162461bcd60e51b81526004016104c090613791565b611dd48a7f00000000000000000000000000000000000000000000000000000000000000008b348c8c612f01565b90945092505f611e257f00000000000000000000000000000000000000000000000000000000000000008c7f00000000000000000000000000000000000000000000000000000000000000006125cd565b9050611e338b3383886126a8565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0856040518263ffffffff1660e01b81526004015f604051808303818588803b158015611e8c575f5ffd5b505af1158015611e9e573d5f5f3e3d5ffd5b505060405163a9059cbb60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016935063a9059cbb9250611ef191508490889060040161393d565b6020604051808303815f875af1158015611f0d573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611f319190613956565b611f3d57611f3d613248565b6040516335313c2160e11b81526001600160a01b03821690636a62784290611f69908a90600401613698565b6020604051808303815f875af1158015611f85573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611fa99190613926565b925083341115611fc657611fc633611fc186346137d6565b61235c565b505096509650969350505050565b60608142811015611ff75760405162461bcd60e51b81526004016104c090613791565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031686865f818110612033576120336137e9565b905060200201602081019061204891906137fd565b6001600160a01b03161461206e5760405162461bcd60e51b81526004016104c09061381f565b6120cb7f0000000000000000000000000000000000000000000000000000000000000000888888808060200260200160405190810160405280939291908181526020018383602002808284375f9201919091525061289692505050565b915034825f815181106120e0576120e06137e9565b602002602001015111156121065760405162461bcd60e51b81526004016104c0906138e0565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d0e30db0835f81518110612147576121476137e9565b60200260200101516040518263ffffffff1660e01b81526004015f604051808303818588803b158015612178575f5ffd5b505af115801561218a573d5f5f3e3d5ffd5b50505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663a9059cbb6121f47f000000000000000000000000000000000000000000000000000000000000000089895f818110610d9057610d906137e9565b845f81518110612206576122066137e9565b60200260200101516040518363ffffffff1660e01b815260040161222b92919061393d565b6020604051808303815f875af1158015612247573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061226b9190613956565b61227757612277613248565b6122b5828787808060200260200160405190810160405280939291908181526020018383602002808284375f920191909152508992506126d6915050565b815f815181106122c7576122c76137e9565b60200260200101513411156114785761147833835f815181106122ec576122ec6137e9565b602002602001015134611fc191906137d6565b61235783846001600160a01b031663a9059cbb858560405160240161232592919061393d565b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050613113565b505050565b5f5f5f5f5f85875af19050806123575760405162461bcd60e51b815260206004820152601360248201527211551217d514905394d1915497d19052531151606a1b60448201526064016104c0565b5f5f841161240d5760405162461bcd60e51b815260206004820152602a60248201527f4d797377617056324c6962726172793a20494e53554646494349454e545f494e60448201526914155517d05353d5539560b21b60648201526084016104c0565b5f8311801561241b57505f82115b6124375760405162461bcd60e51b81526004016104c090613a41565b5f612444856103e5613a88565b90505f6124518483613a88565b90505f82612461876103e8613a88565b61246b9190613a9f565b90506124778183613ab2565b979650505050505050565b60606002825110156124a65760405162461bcd60e51b81526004016104c090613ad1565b81516001600160401b038111156124bf576124bf6133f5565b6040519080825280602002602001820160405280156124e8578160200160208202803683370190505b50905082815f815181106124fe576124fe6137e9565b6020026020010181815250505f5b6001835161251a91906137d6565b8110156125c5575f5f61256c87868581518110612539576125396137e9565b60200260200101518786600161254f9190613a9f565b8151811061255f5761255f6137e9565b6020026020010151613176565b91509150612594848481518110612585576125856137e9565b602002602001015183836123aa565b846125a0856001613a9f565b815181106125b0576125b06137e9565b6020908102919091010152505060010161250c565b509392505050565b5f5f5f6125da8585612e0d565b6040516001600160601b0319606084811b8216602084015283901b16603482015291935091508690604801604051602081830303815290604052805190602001206040518060200161262b9061323b565b6020820181038252601f19601f8201166040525080519060200120604051602001612686939291906001600160f81b0319815260609390931b6001600160601b03191660018401526015830191909152603582015260550190565b60408051601f1981840301815291905280516020909101209695505050505050565b6126d084856001600160a01b03166323b872dd86868660405160240161232593929190613971565b50505050565b5f5b600183516126e691906137d6565b8110156126d0575f5f848381518110612701576127016137e9565b6020026020010151858460016127179190613a9f565b81518110612727576127276137e9565b6020026020010151915091505f61273e8383612e0d565b5090505f8761274e866001613a9f565b8151811061275e5761275e6137e9565b602002602001015190505f5f836001600160a01b0316866001600160a01b03161461278a57825f61278d565b5f835b915091505f60028a516127a091906137d6565b88106127ac57886127fa565b6127fa7f0000000000000000000000000000000000000000000000000000000000000000878c6127dd8c6002613a9f565b815181106127ed576127ed6137e9565b60200260200101516125cd565b90506128277f000000000000000000000000000000000000000000000000000000000000000088886125cd565b6001600160a01b031663022c0d9f8484846040518463ffffffff1660e01b815260040161285693929190613b08565b5f604051808303815f87803b15801561286d575f5ffd5b505af115801561287f573d5f5f3e3d5ffd5b5050600190990198506126d8975050505050505050565b60606002825110156128ba5760405162461bcd60e51b81526004016104c090613ad1565b81516001600160401b038111156128d3576128d36133f5565b6040519080825280602002602001820160405280156128fc578160200160208202803683370190505b50905082816001845161290f91906137d6565b8151811061291f5761291f6137e9565b6020026020010181815250505f6001835161293a91906137d6565b90505b80156125c5575f8061297f87866129556001876137d6565b81518110612965576129656137e9565b602002602001015187868151811061255f5761255f6137e9565b915091506129a7848481518110612998576129986137e9565b60200260200101518383612c94565b846129b36001866137d6565b815181106129c3576129c36137e9565b602002602001018181525050505080806129dc90613b35565b91505061293d565b5f5b600183516129f491906137d6565b811015612357575f5f848381518110612a0f57612a0f6137e9565b602002602001015185846001612a259190613a9f565b81518110612a3557612a356137e9565b6020026020010151915091505f612a4c8383612e0d565b5090505f612a7b7f000000000000000000000000000000000000000000000000000000000000000085856125cd565b90505f5f5f5f846001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa158015612abd573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612ae19190613b60565b506001600160701b031691506001600160701b031691505f5f876001600160a01b03168a6001600160a01b031614612b1a578284612b1d565b83835b91509150818a6001600160a01b03166370a08231896040518263ffffffff1660e01b8152600401612b4e9190613698565b602060405180830381865afa158015612b69573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612b8d9190613926565b612b9791906137d6565b9550612ba48683836123aa565b9450505050505f5f856001600160a01b0316886001600160a01b031614612bcc57825f612bcf565b5f835b915091505f60028c51612be291906137d6565b8a10612bee578a612c1f565b612c1f7f0000000000000000000000000000000000000000000000000000000000000000898e6127dd8e6002613a9f565b60405163022c0d9f60e01b81529091506001600160a01b0387169063022c0d9f90612c5290869086908690600401613b08565b5f604051808303815f87803b158015612c69575f5ffd5b505af1158015612c7b573d5f5f3e3d5ffd5b50506001909b019a506129e69950505050505050505050565b5f5f8411612cf75760405162461bcd60e51b815260206004820152602a60248201527f4d797377617056324c6962726172793a20494e535546464943454e545f4f555460448201526914155517d05353d5539560b21b60648201526084016104c0565b5f83118015612d0557505f82115b612d215760405162461bcd60e51b81526004016104c090613a41565b5f612d2c8585613a88565b612d38906103e8613a88565b90505f612d4586856137d6565b612d51906103e5613a88565b9050612d5d8183613ab2565b612d68906001613a9f565b9695505050505050565b5f5f8411612dce5760405162461bcd60e51b8152602060048201526024808201527f4d797377617056324c6962726172793a20494e53554646494349454e545f414d60448201526313d5539560e21b60648201526084016104c0565b5f83118015612ddc57505f82115b612df85760405162461bcd60e51b81526004016104c090613a41565b82612e038386613a88565b61059f9190613ab2565b5f5f826001600160a01b0316846001600160a01b031603612e7c5760405162461bcd60e51b815260206004820152602360248201527f4d797377617056324c6962726172793a204944454e544943414c5f414444525260448201526245535360e81b60648201526084016104c0565b826001600160a01b0316846001600160a01b031610612e9c578284612e9f565b83835b90925090506001600160a01b038216612efa5760405162461bcd60e51b815260206004820152601d60248201527f4d797377617056324c6962726172793a205a45524f5f4144445245535300000060448201526064016104c0565b9250929050565b60405163e6a4390560e01b81525f90819081907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063e6a4390590612f55908c908c90600401613bac565b602060405180830381865afa158015612f70573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612f949190613bc6565b6001600160a01b031603613032576040516364e329cb60e11b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c9c6539690612ff0908b908b90600401613bac565b6020604051808303815f875af115801561300c573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906130309190613bc6565b505b5f5f61305f7f00000000000000000000000000000000000000000000000000000000000000008b8b613176565b91509150815f148015613070575080155b1561308057879350869250613106565b5f61308c898484612d72565b90508781116130c057858110156130b55760405162461bcd60e51b81526004016104c0906139fc565b889450925082613104565b5f6130cc898486612d72565b9050898111156130de576130de613248565b878110156130fe5760405162461bcd60e51b81526004016104c0906139b7565b94508793505b505b5050965096945050505050565b5f5f60205f8451602086015f885af180613132576040513d5f823e3d81fd5b50505f513d91508115613149578060011415613156565b6001600160a01b0384163b155b156126d05783604051635274afe760e01b81526004016104c09190613698565b5f5f5f6131838585612e0d565b5090505f5f6131938888886125cd565b6001600160a01b0316630902f1ac6040518163ffffffff1660e01b8152600401606060405180830381865afa1580156131ce573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906131f29190613b60565b506001600160701b031691506001600160701b03169150826001600160a01b0316876001600160a01b03161461322957808261322c565b81815b90999098509650505050505050565b61231580613be283390190565b634e487b7160e01b5f52600160045260245ffd5b6001600160a01b0381168114613270575f5ffd5b50565b803561327e8161325c565b919050565b5f5f5f5f5f5f60c08789031215613298575f5ffd5b86356132a38161325c565b955060208701359450604087013593506060870135925060808701356132c88161325c565b9598949750929591949360a090920135925050565b5f5f5f606084860312156132ef575f5ffd5b505081359360208301359350604090920135919050565b5f5f83601f840112613316575f5ffd5b5081356001600160401b0381111561332c575f5ffd5b6020830191508360208260051b8501011115612efa575f5ffd5b5f5f5f5f5f5f60a0878903121561335b575f5ffd5b863595506020870135945060408701356001600160401b0381111561337e575f5ffd5b61338a89828a01613306565b909550935050606087013561339e8161325c565b95989497509295919493608090920135925050565b602080825282518282018190525f918401906040840190835b818110156133ea5783518352602093840193909201916001016133cc565b509095945050505050565b634e487b7160e01b5f52604160045260245ffd5b5f5f6040838503121561341a575f5ffd5b8235915060208301356001600160401b03811115613436575f5ffd5b8301601f81018513613446575f5ffd5b80356001600160401b0381111561345f5761345f6133f5565b604051600582901b90603f8201601f191681016001600160401b038111828210171561348d5761348d6133f5565b6040529182526020818401810192908101888411156134aa575f5ffd5b6020850194505b838510156134d0576134c285613273565b8152602094850194016134b1565b50809450505050509250929050565b8015158114613270575f5ffd5b803560ff8116811461327e575f5ffd5b5f5f5f5f5f5f5f5f5f5f5f6101608c8e031215613517575f5ffd5b8b356135228161325c565b9a5060208c01356135328161325c565b995060408c0135985060608c0135975060808c0135965060a08c01356135578161325c565b955060c08c0135945060e08c013561356e816134df565b935061357d6101008d016134ec565b9a9d999c50979a969995989497509295919493610120830135935061014090920135919050565b5f5f5f5f5f5f5f5f5f5f6101408b8d0312156135be575f5ffd5b8a356135c98161325c565b995060208b0135985060408b0135975060608b0135965060808b01356135ee8161325c565b955060a08b0135945060c08b0135613605816134df565b935061361360e08c016134ec565b999c989b509699959894979396509194610100810135936101209091013592509050565b5f5f5f5f5f6080868803121561364b575f5ffd5b8535945060208601356001600160401b03811115613667575f5ffd5b61367388828901613306565b90955093505060408601356136878161325c565b949793965091946060013592915050565b6001600160a01b0391909116815260200190565b5f5f5f5f5f5f5f60e0888a0312156136c2575f5ffd5b87356136cd8161325c565b965060208801356136dd8161325c565b955060408801359450606088013593506080880135925060a08801356137028161325c565b96999598509396929591949193505060c09091013590565b5f5f5f5f5f5f5f5f610100898b031215613732575f5ffd5b883561373d8161325c565b9750602089013561374d8161325c565b965060408901359550606089013594506080890135935060a0890135925060c08901356137798161325c565b979a969950949793969295919450919260e001359150565b602080825260179082015276135e5cddd85c158c949bdd5d195c8e8811561412549151604a1b604082015260600190565b634e487b7160e01b5f52601160045260245ffd5b818103818111156108fc576108fc6137c2565b634e487b7160e01b5f52603260045260245ffd5b5f6020828403121561380d575f5ffd5b81356138188161325c565b9392505050565b6020808252601c908201527b09af2e6eec2e0ac64a4deeae8cae47440929cac82989288bea082a8960231b604082015260600190565b6020808252602a908201527f4d79737761705632526f757465723a20494e53554646494349454e545f4f555460408201526914155517d05353d5539560b21b606082015260800190565b6001600160a01b0397881681529590961660208601526040850193909352606084019190915260ff16608083015260a082015260c081019190915260e00190565b60208082526026908201527f4d79737761705632526f757465723a204558434553534956455f494e5055545f604082015265105353d5539560d21b606082015260800190565b5f60208284031215613936575f5ffd5b5051919050565b6001600160a01b03929092168252602082015260400190565b5f60208284031215613966575f5ffd5b8151613818816134df565b6001600160a01b039384168152919092166020820152604081019190915260600190565b5f5f604083850312156139a6575f5ffd5b505080516020909101519092909150565b60208082526025908201527f4d79737761705632526f757465723a20494e53554646494349454e545f415f416040820152641353d5539560da1b606082015260800190565b60208082526025908201527f4d79737761705632526f757465723a20494e53554646494349454e545f425f416040820152641353d5539560da1b606082015260800190565b60208082526027908201527f4d797377617056324c6962726172793a20494e53554646494349454e545f4c496040820152665155494449545960c81b606082015260800190565b80820281158282048414176108fc576108fc6137c2565b808201808211156108fc576108fc6137c2565b5f82613acc57634e487b7160e01b5f52601260045260245ffd5b500490565b6020808252601d908201527f4d797377617056324c6962726172793a20494e56414c49445f50415448000000604082015260600190565b92835260208301919091526001600160a01b031660408201526080606082018190525f9082015260a00190565b5f81613b4357613b436137c2565b505f190190565b80516001600160701b038116811461327e575f5ffd5b5f5f5f60608486031215613b72575f5ffd5b613b7b84613b4a565b9250613b8960208501613b4a565b9150604084015163ffffffff81168114613ba1575f5ffd5b809150509250925092565b6001600160a01b0392831681529116602082015260400190565b5f60208284031215613bd6575f5ffd5b81516138188161325c56fe60c06040526001600b55348015610014575f5ffd5b50466080526100ec604080518082018252600981526826bcb9bbb0b8102b1960b91b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527f164440f7a233cc87ab8692db5396e1cd0f283cabe75afa2039628a3f36bab784818401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a0808301919091528351808303909101815260c0909101909252815191012090565b60a052600480546001600160a01b0319163317905560805160a0516121e56101305f395f818161040f0152610ab401525f818161039901526109bb01526121e55ff3fe608060405234801561000f575f5ffd5b506004361061015d575f3560e01c8063022c0d9f1461016157806306fdde03146101765780630902f1ac146101b4578063095ea7b3146101e85780630dfe16811461020b57806318160ddd1461022b57806323b872dd1461024157806330adf81f14610254578063313ce567146102685780633644e51514610282578063485cc9551461028a5780635909c0d51461029d5780635a3d5493146102a65780636a627842146102af57806370a08231146102c25780637464fc3d146102e15780637ecebe00146102ea57806389afcb441461030957806395d89b4114610331578063a9059cbb14610355578063ba9a7a5614610368578063bc25cf7714610371578063c45a015514610384578063d20e900814610397578063d21220a7146103bd578063d505accf146103d0578063dd62ed3e146103e3578063e496eb441461040d578063fff6cae914610433575b5f5ffd5b61017461016f366004611d6f565b61043b565b005b61019e6040518060400160405280600981526020016826bcb9bbb0b8102b1960b91b81525081565b6040516101ab9190611dfd565b60405180910390f35b6101bc610929565b604080516001600160701b03948516815293909216602084015263ffffffff16908201526060016101ab565b6101fb6101f6366004611e32565b610953565b60405190151581526020016101ab565b60055461021e906001600160a01b031681565b6040516101ab9190611e5c565b6102335f5481565b6040519081526020016101ab565b6101fb61024f366004611e70565b610969565b6102335f5160206121505f395f51905f5281565b610270601281565b60405160ff90911681526020016101ab565b6102336109b8565b610174610298366004611eae565b610ad6565b61023360085481565b61023360095481565b6102336102bd366004611ee5565b610b54565b6102336102d0366004611ee5565b60016020525f908152604090205481565b610233600a5481565b6102336102f8366004611ee5565b60036020525f908152604090205481565b61031c610317366004611ee5565b610e0d565b604080519283526020830191909152016101ab565b61019e6040518060400160405280600581526020016426ac96ab1960d91b81525081565b6101fb610363366004611e32565b61115f565b6102336103e881565b61017461037f366004611ee5565b61116b565b60045461021e906001600160a01b031681565b7f0000000000000000000000000000000000000000000000000000000000000000610233565b60065461021e906001600160a01b031681565b6101746103de366004611f00565b61127f565b6102336103f1366004611eae565b600260209081525f928352604080842090915290825290205481565b7f0000000000000000000000000000000000000000000000000000000000000000610233565b61017461148c565b600b546001146104665760405162461bcd60e51b815260040161045d90611f71565b60405180910390fd5b5f600b558415158061047757505f84115b6104cf5760405162461bcd60e51b8152602060048201526024808201527f4d797377617056323a20494e53554646494349454e545f4f55545055545f414d60448201526313d5539560e21b606482015260840161045d565b5f5f6104d9610929565b5091509150816001600160701b0316871080156104fe5750806001600160701b031686105b6105375760405162461bcd60e51b815260206004820181905260248201525f5160206121305f395f51905f52604482015260640161045d565b6005546006545f9182916001600160a01b039182169190811690891682148015906105745750806001600160a01b0316896001600160a01b031614155b6105b75760405162461bcd60e51b81526020600482015260146024820152734d797377617056323a20494e56414c49445f544f60601b604482015260640161045d565b8a156105c8576105c8828a8d6115b5565b89156105d9576105d9818a8c6115b5565b8615610641576040516337f3be9760e11b81526001600160a01b038a1690636fe77d2e906106139033908f908f908e908e90600401611f9b565b5f604051808303815f87803b15801561062a575f5ffd5b505af115801561063c573d5f5f3e3d5ffd5b505050505b6040516370a0823160e01b81526001600160a01b038316906370a082319061066d903090600401611e5c565b602060405180830381865afa158015610688573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906106ac9190611fe6565b6040516370a0823160e01b81529094506001600160a01b038216906370a08231906106db903090600401611e5c565b602060405180830381865afa1580156106f6573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061071a9190611fe6565b925050505f89856001600160701b03166107349190612011565b8311610740575f61075d565b6107538a6001600160701b038716612011565b61075d9084612011565b90505f6107738a6001600160701b038716612011565b831161077f575f61079c565b6107928a6001600160701b038716612011565b61079c9084612011565b90505f8211806107ab57505f81115b6108035760405162461bcd60e51b815260206004820152602360248201527f4d797377617056323a20494e53554646494349454e545f494e5055545f414d4f60448201526215539560ea1b606482015260840161045d565b5f61080f836003612024565b61081b866103e8612024565b6108259190612011565b90505f610833836003612024565b61083f866103e8612024565b6108499190612011565b90506108616001600160701b03808916908a16612024565b61086e90620f4240612024565b6108788284612024565b10156108b45760405162461bcd60e51b815260206004820152600b60248201526a4d797377617056323a204b60a81b604482015260640161045d565b50506108c284848888611718565b60408051838152602081018c90529081018c9052606081018b90526001600160a01b038a169033907fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229060800160405180910390a350506001600b55505050505050505050565b6007546001600160701b0380821692600160701b830490911691600160e01b900463ffffffff1690565b5f61095f3384846118e5565b5060015b92915050565b6001600160a01b0383165f90815260026020908152604080832033845290915281208054839190839061099d908490612011565b909155506109ae9050848484611933565b5060019392505050565b5f7f00000000000000000000000000000000000000000000000000000000000000004614610ab15750604080518082018252600981526826bcb9bbb0b8102b1960b91b6020918201528151808301835260018152603160f81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527f164440f7a233cc87ab8692db5396e1cd0f283cabe75afa2039628a3f36bab784818401527fc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc660608201524660808201523060a0808301919091528351808303909101815260c0909101909252815191012090565b507f000000000000000000000000000000000000000000000000000000000000000090565b6004546001600160a01b03163314610b265760405162461bcd60e51b815260206004820152601360248201527226bcb9bbb0b82b191d102327a92124a22222a760691b604482015260640161045d565b600580546001600160a01b039384166001600160a01b03199182161790915560068054929093169116179055565b5f600b54600114610b775760405162461bcd60e51b815260040161045d90611f71565b5f600b81905580610b86610929565b506005546040516370a0823160e01b81529294509092505f916001600160a01b03909116906370a0823190610bbf903090600401611e5c565b602060405180830381865afa158015610bda573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610bfe9190611fe6565b6006546040516370a0823160e01b81529192505f916001600160a01b03909116906370a0823190610c33903090600401611e5c565b602060405180830381865afa158015610c4e573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610c729190611fe6565b90505f610c886001600160701b03861684612011565b90505f610c9e6001600160701b03861684612011565b90505f610cab87876119bf565b5f8054919250819003610cea576103e8610ccd610cc88587612024565b611ae6565b610cd79190612011565b9850610ce55f6103e8611c38565b610d34565b610d316001600160701b038916610d018387612024565b610d0b919061204f565b886001600160701b03165f5486610d229190612024565b610d2c919061204f565b611cad565b98505b5f8911610d805760405162461bcd60e51b815260206004820152602760248201525f5160206121305f395f51905f5260448201526617d3525395115160ca1b606482015260840161045d565b610d8a8a8a611c38565b610d9686868a8a611718565b8115610dbf57600754610dbb906001600160701b03600160701b820481169116612024565b600a555b604080518581526020810185905233917f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f910160405180910390a250506001600b5550949695505050505050565b5f5f600b54600114610e315760405162461bcd60e51b815260040161045d90611f71565b5f600b81905580610e40610929565b506005546006546040516370a0823160e01b81529395509193506001600160a01b03908116929116905f9083906370a0823190610e81903090600401611e5c565b602060405180830381865afa158015610e9c573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610ec09190611fe6565b90505f826001600160a01b03166370a08231306040518263ffffffff1660e01b8152600401610eef9190611e5c565b602060405180830381865afa158015610f0a573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610f2e9190611fe6565b305f90815260016020526040812054919250610f4a88886119bf565b5f5490915080610f5a8685612024565b610f64919061204f565b9a5080610f718585612024565b610f7b919061204f565b99505f8b118015610f8b57505f8a115b610fd35760405162461bcd60e51b815260206004820152602660248201525f5160206121305f395f51905f5260448201526517d09554939160d21b606482015260840161045d565b610fdd3084611cbf565b610fe8878d8d6115b5565b610ff3868d8c6115b5565b6040516370a0823160e01b81526001600160a01b038816906370a082319061101f903090600401611e5c565b602060405180830381865afa15801561103a573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061105e9190611fe6565b6040516370a0823160e01b81529095506001600160a01b038716906370a082319061108d903090600401611e5c565b602060405180830381865afa1580156110a8573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906110cc9190611fe6565b93506110da85858b8b611718565b8115611103576007546110ff906001600160701b03600160701b820481169116612024565b600a555b604080518c8152602081018c90526001600160a01b038e169133917fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496910160405180910390a35050505050505050506001600b81905550915091565b5f61095f338484611933565b600b5460011461118d5760405162461bcd60e51b815260040161045d90611f71565b5f600b556005546006546007546040516370a0823160e01b81526001600160a01b03938416939092169161122d91849186916001600160701b03169083906370a08231906111df903090600401611e5c565b602060405180830381865afa1580156111fa573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061121e9190611fe6565b6112289190612011565b6115b5565b6007546040516370a0823160e01b81526112759183918691600160701b90046001600160701b0316906001600160a01b038416906370a08231906111df903090600401611e5c565b50506001600b5550565b834211156112ca5760405162461bcd60e51b8152602060048201526018602482015277135e5cddd85c158c8e8814195c9b5a5d08115e1c1a5c995960421b604482015260640161045d565b5f60016112d56109b8565b6001600160a01b038a81165f8181526003602090815260409182902080546001810190915582515f5160206121505f395f51905f528184015280840194909452938d166060840152608083018c905260a083019390935260c08083018b90528151808403909101815260e08301909152805192019190912061190160f01b6101008301526101028201929092526101228101919091526101420160408051601f1981840301815282825280516020918201205f84529083018083525260ff871690820152606081018590526080810184905260a0016020604051602081039080840390855afa1580156113ca573d5f5f3e3d5ffd5b5050604051601f1901519150506001600160a01b038116158015906114005750876001600160a01b0316816001600160a01b0316145b61143d5760405162461bcd60e51b815260206004820152600e60248201526d24a72b20a624a22fa9a4a3a722a960911b604482015260640161045d565b6114488888886118e5565b50856001600160a01b0316876001600160a01b03165f5160206121905f395f51905f528760405161147b91815260200190565b60405180910390a350505050505050565b600b546001146114ae5760405162461bcd60e51b815260040161045d90611f71565b5f600b556005546040516370a0823160e01b81526115ae916001600160a01b0316906370a08231906114e4903090600401611e5c565b602060405180830381865afa1580156114ff573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906115239190611fe6565b6006546040516370a0823160e01b81526001600160a01b03909116906370a0823190611553903090600401611e5c565b602060405180830381865afa15801561156e573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906115929190611fe6565b6007546001600160701b0380821691600160701b900416611718565b6001600b55565b5f5f846001600160a01b03166040516020016115f090787472616e7366657228616464726573732c75696e743235362960381b815260190190565b60408051601f198184030181529082905280516020909101206001600160a01b0387166024830152604482018690529060640160408051601f198184030181529181526020820180516001600160e01b03166001600160e01b03199094169390931790925290516116619190612062565b5f604051808303815f865af19150503d805f811461169a576040519150601f19603f3d011682016040523d82523d5f602084013e61169f565b606091505b50915091508180156116c95750805115806116c95750808060200190518101906116c99190612078565b6117115760405162461bcd60e51b8152602060048201526019602482015278135e5cddd85c158c8e881514905394d1915497d19052531151603a1b604482015260640161045d565b5050505050565b6001600160701b03841180159061173657506001600160701b038311155b6117775760405162461bcd60e51b81526020600482015260126024820152714d797377617056323a204f564552464c4f5760701b604482015260640161045d565b5f611786600160201b42612097565b60075490915063ffffffff600160e01b90910481168203908116158015906117b657506001600160701b03841615155b80156117ca57506001600160701b03831615155b1561184d578063ffffffff166117f36117e285611d2c565b6007546001600160701b0316611d44565b600880546001600160e01b03929092169290920201905563ffffffff811661183561181d86611d2c565b600754600160701b90046001600160701b0316611d44565b600980546001600160e01b0392909216929092020190555b506007805463ffffffff8316600160e01b026001600160e01b036001600160701b03888116600160701b9081026001600160e01b03199095168b83161794909417918216831794859055604080519382169282169290921783529290930490911660208201527f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1910160405180910390a15050505050565b6001600160a01b038381165f8181526002602090815260408083209487168084529482529182902085905590518481525f5160206121905f395f51905f5291015b60405180910390a3505050565b6001600160a01b0383165f908152600160205260408120805483929061195a908490612011565b90915550506001600160a01b0382165f90815260016020526040812080548392906119869084906120aa565b92505081905550816001600160a01b0316836001600160a01b03165f5160206121705f395f51905f528360405161192691815260200190565b6004805460408051622fcfcb60e31b815290515f9384936001600160a01b03169263017e7e5892818301926020928290030181865afa158015611a04573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611a2891906120bd565b600a546001600160a01b038216158015945091925090611ad3578015611ace575f611a62610cc86001600160701b03808816908916612024565b90505f611a6e83611ae6565b905080821115611acb575f611a838284612011565b5f54611a8f9190612024565b90505f82611a9e856005612024565b611aa891906120aa565b90505f611ab5828461204f565b90508015611ac757611ac78782611c38565b5050505b50505b611ade565b8015611ade575f600a555b505092915050565b5f60018211611af3575090565b816001600160801b8210611b0c5760809190911c9060401b5b600160401b8210611b225760409190911c9060201b5b600160201b8210611b385760209190911c9060101b5b620100008210611b4d5760109190911c9060081b5b6101008210611b615760089190911c9060041b5b60108210611b745760049190911c9060021b5b60048210611b805760011b5b600302600190811c90818581611b9857611b9861203b565b048201901c90506001818581611bb057611bb061203b565b048201901c90506001818581611bc857611bc861203b565b048201901c90506001818581611be057611be061203b565b048201901c90506001818581611bf857611bf861203b565b048201901c90506001818581611c1057611c1061203b565b048201901c9050611c2f818581611c2957611c2961203b565b04821190565b90039392505050565b6001600160a01b0382165f9081526001602052604081208054839290611c5f9084906120aa565b92505081905550805f5f828254611c7691906120aa565b90915550506040518181526001600160a01b038316905f905f5160206121705f395f51905f52906020015b60405180910390a35050565b5f8282188284100282185b9392505050565b6001600160a01b0382165f9081526001602052604081208054839290611ce6908490612011565b92505081905550805f5f828254611cfd9190612011565b90915550506040518181525f906001600160a01b038416905f5160206121705f395f51905f5290602001611ca1565b5f6109636001600160701b038316600160701b6120d8565b5f611cb86001600160701b03831684612101565b6001600160a01b0381168114611d6c575f5ffd5b50565b5f5f5f5f5f60808688031215611d83575f5ffd5b85359450602086013593506040860135611d9c81611d58565b925060608601356001600160401b03811115611db6575f5ffd5b8601601f81018813611dc6575f5ffd5b80356001600160401b03811115611ddb575f5ffd5b886020828401011115611dec575f5ffd5b959894975092955050506020019190565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b5f5f60408385031215611e43575f5ffd5b8235611e4e81611d58565b946020939093013593505050565b6001600160a01b0391909116815260200190565b5f5f5f60608486031215611e82575f5ffd5b8335611e8d81611d58565b92506020840135611e9d81611d58565b929592945050506040919091013590565b5f5f60408385031215611ebf575f5ffd5b8235611eca81611d58565b91506020830135611eda81611d58565b809150509250929050565b5f60208284031215611ef5575f5ffd5b8135611cb881611d58565b5f5f5f5f5f5f5f60e0888a031215611f16575f5ffd5b8735611f2181611d58565b96506020880135611f3181611d58565b95506040880135945060608801359350608088013560ff81168114611f54575f5ffd5b9699959850939692959460a0840135945060c09093013592915050565b60208082526010908201526f1b5e5cddd85c158c8e881313d0d2d15160821b604082015260600190565b60018060a01b038616815284602082015283604082015260806060820152816080820152818360a08301375f81830160a090810191909152601f909201601f19160101949350505050565b5f60208284031215611ff6575f5ffd5b5051919050565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561096357610963611ffd565b808202811582820484141761096357610963611ffd565b634e487b7160e01b5f52601260045260245ffd5b5f8261205d5761205d61203b565b500490565b5f82518060208501845e5f920191825250919050565b5f60208284031215612088575f5ffd5b81518015158114611cb8575f5ffd5b5f826120a5576120a561203b565b500690565b8082018082111561096357610963611ffd565b5f602082840312156120cd575f5ffd5b8151611cb881611d58565b6001600160e01b03818116838216818102909216918183048114821517611ade57611ade611ffd565b5f6001600160e01b038316806121195761211961203b565b6001600160e01b0392909216919091049291505056fe4d797377617056323a20494e53554646494349454e545f4c4951554944495459fc77c2b9d30fe91687fd39abb7d16fcdfe1472d065740051ab8b13e4bf4a617fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925a26469706673582212208053b585c3c6bc7a4e5779c75512396711c43d397b9264d7a3b0314825f922af64736f6c634300081e0033a26469706673582212200572ee5a242bd0f77fb08a6c123cf346c8447f5d3741eab8dfba54d22a742f5664736f6c634300081e0033" as `0x${string}`