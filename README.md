## JVM in TypeScript

### Setup

```bash
$ npm i
$ npm link
```

### Run

```bash
$ tsjava java.lang.String
version: 52.0
constants count: 548
access flags: 0x31
this class: java/lang/String
super class: java/lang/Object
interfaces: java/io/Serializable,java/lang/Comparable,java/lang/CharSequence
fields count: 5
  value
  hash
  serialVersionUID
  serialPersistentFields
  CASE_INSENSITIVE_ORDER
methods count: 94
  <init>
  <init>
  <init>
  ...
```

- [ ] static methods as factory methods
- [ ] store stack frame variables as is
- [ ] implement other AttributeInfo
- [ ] modified utf8
- [ ] cache file list in zip
- [ ] iushr optimization
