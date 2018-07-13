# SCNU LOST GOODS Business Network

> This is the SCNU LOST GOODS of Hyperledger Composer samples.

This business network defines:

**Participant**
`SchoolParticipant`

**Asset**
`GoodsAsset`

**Transaction**

- `SubmitLostGoodsTransaction`: I lost my goods, submit and write it to blockchain;
- `SubmitFoundGoodsTransaction`: I found something, submit and write it to blockchain;
- `SubmitLostGoodsTransaction`: Someone revert lost goods, submit and write it to blockchain;
- `PickTransaction`: Someone picked your lost goods and tell everyone I found it;
- `RevertTransaction`: Picker reverts the lost goods to STUU;
- `ReturnBackTransaction`: Lost goods are returned back to its owner;
- `CancelTransaction`: Owner cancel to find his goods.

> Read `lost.cto` to know structure of transactions

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

Submit a `SubmitLostGoodsTransaction` transaction:

```json
{
  "$class": "cn.edu.scnu.lost.SubmitLostGoodsTransaction",
  "goodsId": "1",
  "type": "STUDENT_ECARD"
}
```

After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `GoodsLostEvent` has been emitted. And new lost goods is submitted in Blockchain.

Congratulations!

## Enumerations

### `GoodsType`

- `SCNU_ECARD`: 华师一卡通
- `GZ_UNITOWN_ECARD`: 大学城一卡通
- `STUDENT_ID_CARD`: 学生证
- `TRANSPORT_PASS`: 交通卡
- `MOBILE_PHONE`: 手机
- `BICYCLE`: 自行车
- `LAPTOP`: 笔记本电脑
- `KEY_PAIR`: 钥匙
- `OTHERS`: 其他

### `GoodsState`

- `LOST`: 物品已丢失
- `FOUND`: 物品已找回
- `REVERTED`: 招领站已接收物品
- `RETURNED`: 物品已归还失主
- `CANCELED`: 失主取消失物登记


## License

Apache-2.0