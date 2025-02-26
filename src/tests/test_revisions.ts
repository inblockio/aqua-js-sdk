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

export { mockAquaTreeOnerevision, mockAquaTreeTworevisions }