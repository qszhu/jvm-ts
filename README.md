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

```bash
$ tsjava --cp java jvmgo.book.ch05.GaussTest
version: 52.0
constants count: 28
access flags: 0x21
this class: jvmgo/book/ch05/GaussTest
super class: java/lang/Object
interfaces: 
fields count: 0
methods count: 2
  <init>
  main
pc: 0 inst: IConst0
pc: 1 inst: IStore1
pc: 2 inst: IConst1
pc: 3 inst: IStore2
pc: 4 inst: ILoad2
pc: 5 inst: BiPush
pc: 7 inst: IfICmpGT
pc: 10 inst: ILoad1
pc: 11 inst: ILoad2
pc: 12 inst: IAdd
pc: 13 inst: IStore1
pc: 14 inst: IInc
pc: 17 inst: Goto
...
```

### References
* https://github.com/zxh0/jvmgo-book
