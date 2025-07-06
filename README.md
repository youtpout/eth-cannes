# eth-cannes


## Noir

In the noir folder, test the circuit
```
nargo test --show-output
```

Ref for srs https://github.com/zkmopro/noir-rs?tab=readme-ov-file#downloading-srs-structured-reference-string

Compile
```
nargo compile
```

Generate solidity verifier
```
bb write_vk -b ./target/noir.json -o ./target --oracle_hash keccak

bb write_solidity_verifier -k ./target/vk -o ./target/Verifier.sol
```

## SRS

Compile srs file from noir.json

```
cargo run --bin srs_downloader --features srs-downloader -- -c ../noir/target/noir.json
```

Copy it in mopro-ui test-vectors/noir and react-native/assets/keys



## server
set env 
```
RPC_URL="https://rpc.sepolia.mantle.xyz"
PRIVATE_KEY=0dx
CONTRACT_ADDRESS=0x5f4b4A9a2D0d0Ee37b5a3c9b754c8D9Fb0FAbE29
```

start
```
npm run start
```

## contracts
Deployed on sepolia mantle

honk verifier 0x4D3eED066632451A64EB810277B051A044505F53
nft 0x5f4b4A9a2D0d0Ee37b5a3c9b754c8D9Fb0FAbE29
pop 0xF24aA1e7C4Efb304D32374d7f096E8F085e741c0
