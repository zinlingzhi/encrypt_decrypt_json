# encrypt_decrypt_json
## Run Server:
node index.js

## Test Server
Please test with endpoint with two endpoints: 'store', 'retreieve'
Store:
Url:
```
http://localhost:3000/store
```
Method:
```
Post
```

Body:
```
Type: Json
Value: {
    id: 1,
    key: 'abcdefg123456',
    value: {
        "a": "b",
        "c": "d"
    }
}
```

Retrieve:
Url:
```
http://localhost:3000/retrieve
```
Method:
```
Get
```

Body:
```
Type: Query
Value: {
    id: 1,
    key: 'abcdefg123456',
}
```