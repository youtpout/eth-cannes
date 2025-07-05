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
cargo run --bin srs_downloader --features srs-downloader -- -c target/noir.json
```