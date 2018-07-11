# SCNU LOST GOODS Business Network

> This is the SCNU LOST GOODS of Hyperledger Composer samples.

This business network defines:

**Participant**
`SchoolParticipant`

**Asset**
`GoodsAsset`

**Transaction**

- `CreateLostTransaction`: I lost my goods, submit and write it to blockchain;
- `PickTransaction`: Someone picked your lost goods and tell everyone I found it;
- `RevertTransaction`: Picker reverts the lost goods to STUU;
- `ReturnBackTransaction`: Lost goods are returned back to its owner;
- `CancelTransaction`: Owner cancel to find his goods.

**Event**
`GoodsLostEvent`, `GoodsFoundEvent`, `GoodsRevertedEvent`, 
`GoodsReturnEvent`, `GoodsCancelEvent`

## Test

To test this Business Network Definition in the **Test** tab:

Create a `SchoolParticipant` participant:

```json
{
  "$class": "cn.edu.scnu.lost.SchoolParticipant",
  "cardId": "20180123",
  "name": "Toby",
  "department": "Network Center"
}
```

Submit a `CreateLostTransaction` transaction:

```json
{
  "$class": "cn.edu.scnu.lost.CreateLostTransaction",
  "goodsId": "1",
  "type": "STUDENT_ECARD"
}
```

After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `GoodsLostEvent` has been emitted. And new lost goods is submitted in Blockchain.

Congratulations!

## License

Apache-2.0