import { AquaTree } from "../types";



const mockAquaTreeOnerevision: AquaTree = {
    "revisions": {
        "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a": {
            "previous_verification_hash": "",
            "local_timestamp": "20250217100937",
            "revision_type": "file",
            "file_hash": "a824e1e0de009be74928831a9e05536b3c96ddcaf5e8276aa8f4766522db14af",
            "file_nonce": "b98184b9fecdcbadcd0e67dea9d5f9229087f593ce3acbc796e9587b5dbe6df0",
            "version": " https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar"
        }
    },
    "file_index": {
        "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a": "LICENSE"
    },
    "tree": {
        "hash": "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a",
        "children": []
    },
    "treeMapping": {
        "paths": {
            "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a": [
                "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a"
            ]
        },
        "latestHash": "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a"
    }
};


const mockAquaTreeTworevisions: AquaTree = {
    "revisions": {
        "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a": {
            "previous_verification_hash": "",
            "local_timestamp": "20250217100937",
            "revision_type": "file",
            "file_hash": "a824e1e0de009be74928831a9e05536b3c96ddcaf5e8276aa8f4766522db14af",
            "file_nonce": "b98184b9fecdcbadcd0e67dea9d5f9229087f593ce3acbc796e9587b5dbe6df0",
            "version": " https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar"
        },
        "0x4ec034985f57fd006c77400947ee266713f410867952cab2c21883f3880c7162": {
            "previous_verification_hash": "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a",
            "local_timestamp": "20250218102950",
            "revision_type": "signature",
            "signature": "0xe21d340645e3c0f96ba7bc7e778e454154325ed6bf97e34fbdd08225722713f571e18b7a52befc4c829156c2d5752a5a6ed08ea85a28865048576820d87310b61b",
            "signature_public_key": "0x0380a77a1a6d59be5c10d7ee5e10def79283938bb8a60025d0fe5404e650e8ccc1",
            "signature_wallet_address": "0x568a94a8f0f3dc0b245b853bef572075c1df5c50",
            "signature_type": "ethereum:eip-191",
            "version": " https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar"
        }
    },
    "file_index": {
        "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a": "LICENSE"
    },
    "tree": {
        "hash": "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a",
        "children": [
            {
                "hash": "0x4ec034985f57fd006c77400947ee266713f410867952cab2c21883f3880c7162",
                "children": []
            }
        ]
    },
    "treeMapping": {
        "paths": {
            "0x4ec034985f57fd006c77400947ee266713f410867952cab2c21883f3880c7162": [
                "0x7b4d910a1c3c1e6b08040826dd3c6c27d80d1f34051d18dfd85980e95eb9a78a",
                "0x4ec034985f57fd006c77400947ee266713f410867952cab2c21883f3880c7162"
            ]
        },
        "latestHash": "0x4ec034985f57fd006c77400947ee266713f410867952cab2c21883f3880c7162"
    }
}


const mockAquaTreeTworevisionsReArranged: AquaTree = {
    "revisions": {
        "0x361adf930670771bdb0c1e2c4bc109e30047bb3a0c2b9f89704255a6f3000dae": {
            "revision_type": "signature",
            "previous_verification_hash": "0x6c5544021930b7887455e21F00b157b2FA572667_0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557",
            "local_timestamp": "Fri Mar 14 2025",
            "file_nonce": "",
            "version": "https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar",
            "signature": "0x059e1493dca223e8cf679f21b84f2a71b0339bd3f5656aa4b374c8ed8fe0db0d2b6c77f9ba2521baadbc116a701f865c0b0117722f69dd3389bbacc626c42e831b",
            "signature_public_key": "0x04170e3af46328f743892d652a7e11faadb9800cc3023b00621bd9a06319ffcb0d02c86ce5d303028e5dea56291d38260a821061226f8e1197cec15dcbb0b887bc",
            "signature_wallet_address": null,
            "signature_type": "ethereum:eip-191"
        },
        "0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557": {
            "revision_type": "file",
            "previous_verification_hash": "",
            "local_timestamp": "Fri Mar 14 2025",
            "file_nonce": "cadb3750fe0d9ef66e31fdef15b6ee8d39b6a15e83088af494583a11aab2bb07",
            "version": "https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar",
            "file_hash": "31f2f715138fd28a45d0e567d952f98516d216ec135cf28ca9a07a49db487db0"
        }
    },
    "file_index": {
        "0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557": "sample.txt"
    }

}

const mockAquaTreeThreeRevisionsP12: AquaTree =  {
    revisions: {
      '0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557': {
        file_hash: '31f2f715138fd28a45d0e567d952f98516d216ec135cf28ca9a07a49db487db0',
        file_nonce: 'cadb3750fe0d9ef66e31fdef15b6ee8d39b6a15e83088af494583a11aab2bb07',
        local_timestamp: 'Fri Mar 14 2025',
        previous_verification_hash: '',
        revision_type: 'file',
        version: 'https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar'
      },
      '0x361adf930670771bdb0c1e2c4bc109e30047bb3a0c2b9f89704255a6f3000dae': {
        file_nonce: '',
        local_timestamp: 'Fri Mar 14 2025',
        previous_verification_hash: '0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557',
        revision_type: 'signature',
        signature: '0x059e1493dca223e8cf679f21b84f2a71b0339bd3f5656aa4b374c8ed8fe0db0d2b6c77f9ba2521baadbc116a701f865c0b0117722f69dd3389bbacc626c42e831b',
        signature_public_key: '0x04170e3af46328f743892d652a7e11faadb9800cc3023b00621bd9a06319ffcb0d02c86ce5d303028e5dea56291d38260a821061226f8e1197cec15dcbb0b887bc',
        signature_type: 'ethereum:eip-191',
        signature_wallet_address: null,
        version: 'https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar'
      },
      '0x670ec99afd75eeea565104de3569b5e76ba2f4f1b207aadcddfd9deefb4ceed4': {
        local_timestamp: '20250530122538',
        previous_verification_hash: '0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557',
        revision_type: 'signature',
        signature: '1a5eaba8283bad35e17094ecf2bd09113253948adc7d5b965d11413c27ca0b16debf2f1313503b347efc5e97b6530d61f83f9682d7f2f3129f24cf8bf091baa98b62608fa67798d050bfe1a45558ab5bf021b6fc1033bf78c1d022d436e26182c3a87399a53ddea28ed04b128f0ca84d2aca0d9d48f5a4460e1c81b4de991a7e25ddc5ae15eb147b1eecc08fb54646cb1e5c7cc9a9e7122cd55392742021edbe0695f31fbdc3408c0dba3a1463ce8fa138b02f82ee342643be420002700370eb057894b0de947f4c8b530d1ad4424fe015a0562a7aef10e9153a938aec9b05fdb0b2c6e1dda704e0542c3d155abb4a1c67d36c2c54232ad543ba6412cb1378c3',
        signature_public_key: '30820122300d06092a864886f70d01010105000382010f003082010a0282010100966083a6a9cdd34d42ba742571a44b2e045f4db9550d3e9274bb8377d275a6d9356faa981d4f4055228b3ee35685c66dce261e1abeb72b74a8b8827aab3d00c63add2ba9f485a8c43300e5d08f4261680427987e10195e7da3d121e7e260a7a94fc0b89b4e78c4a99d7765c3b0fe0cba6709605a8bd72148237eaa86c6936377688128514cde39b11fb1456968cce2e1e675618fe27e3653d905087c9be10968d2d1b1ce783f4a57696d6c0f6efd7b2bd657d8bd5bf549d96a79bb6f4753dcb8d36c287d4f2517bd29a069bf1a6f9017add07c04101fe9de5601d4b891b9a4477f89e972f8cc752bdf2aad8fb680498751077cf9bfbf13fc532d3b6c1dbbdfdd0203010001',
        signature_type: 'p12',
        signature_wallet_address: '30820122300d06092a864886f70d01010105000382010f003082010a0282010100966083a6a9cdd34d42ba742571a44b2e045f4db9550d3e9274bb8377d275a6d9356faa981d4f4055228b3ee35685c66dce261e1abeb72b74a8b8827aab3d00c63add2ba9f485a8c43300e5d08f4261680427987e10195e7da3d121e7e260a7a94fc0b89b4e78c4a99d7765c3b0fe0cba6709605a8bd72148237eaa86c6936377688128514cde39b11fb1456968cce2e1e675618fe27e3653d905087c9be10968d2d1b1ce783f4a57696d6c0f6efd7b2bd657d8bd5bf549d96a79bb6f4753dcb8d36c287d4f2517bd29a069bf1a6f9017add07c04101fe9de5601d4b891b9a4477f89e972f8cc752bdf2aad8fb680498751077cf9bfbf13fc532d3b6c1dbbdfdd0203010001',
        version: 'https://aqua-protocol.org/docs/v3/schema_2 | SHA256 | Method: scalar'
      }
    },
    file_index: {
      '0xfcce86f9623438a7b1ad7f1c8b80a76bd5a188137e132de31161a86814450557': 'sample.txt'
    }
  }

export { mockAquaTreeOnerevision, mockAquaTreeTworevisions , mockAquaTreeTworevisionsReArranged, mockAquaTreeThreeRevisionsP12}