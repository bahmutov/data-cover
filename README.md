https://astexplorer.net/

For example

```js
function add(a, b) {
  return a + b
}
```

produces the following tree

```json
{
  "type": "Program",
  "start": 0,
  "end": 36,
  "body": [
    {
      "type": "FunctionDeclaration",
      "start": 0,
      "end": 36,
      "id": {
        "type": "Identifier",
        "start": 9,
        "end": 12,
        "name": "add"
      },
      "generator": false,
      "expression": false,
      "params": [
        {
          "type": "Identifier",
          "start": 13,
          "end": 14,
          "name": "a"
        },
        {
          "type": "Identifier",
          "start": 16,
          "end": 17,
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "start": 19,
        "end": 36,
        "body": [
          {
            "type": "ReturnStatement",
            "start": 22,
            "end": 34,
            "argument": {
              "type": "BinaryExpression",
              "start": 29,
              "end": 34,
              "left": {
                "type": "Identifier",
                "start": 29,
                "end": 30,
                "name": "a"
              },
              "operator": "+",
              "right": {
                "type": "Identifier",
                "start": 33,
                "end": 34,
                "name": "b"
              }
            }
          }
        ]
      }
    }
  ],
  "sourceType": "module"
}
```
