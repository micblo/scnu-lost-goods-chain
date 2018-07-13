# SCNU LOST GOODS Business Network

> This is the SCNU LOST GOODS of Hyperledger Composer samples.

This business network defines:

**Participant**
`Person`, `SystemAdmin`

**Asset**
`GoodsAsset`, `WalletAsset`

**Transaction**

- `SubmitLostGoodsTransaction`: I lost my goods, submit and write it to blockchain;
- `SubmitFoundGoodsTransaction`: I found something, submit and write it to blockchain;
- `SubmitLostGoodsTransaction`: Someone revert lost goods, submit and write it to blockchain;
- `PickTransaction`: Someone picked your lost goods and tell everyone I found it;
- `RevertTransaction`: Picker reverts the lost goods to STUU and reward picker (if exists) 10 coins;
- `ReturnBackTransaction`: Lost goods are returned back to its owner and reward picker (if exists) 90 coins;
- `CancelTransaction`: Owner cancel to find his goods;
- `InitWalletTransaction`: Owner init his wallet when registering.

> Read `lost.cto` to know structure of transactions

**Event**
`GoodsLostEvent`, `GoodsFoundEvent`, `GoodsRevertedEvent`, 
`GoodsReturnEvent`, `GoodsCancelEvent`, `WalletInitEvent`, 
`WalletCoinChangeEvent`

## Test

This project can run in Hyperledger Composer Playground, 
you can browse [composer-playground.mybluemix.net](https://composer-playground.mybluemix.net/) to test online demo. If you live in China Mainland, maybe you can not connect to this website but use proxy or VPN to bypass the firewall.

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

## Participant

### `Person`

Namespace: `cn.edu.scnu`

A normal user of university, including students, teachers, staffs and other people.

Person CAN submit infomation of goods that he lost or found.
If person give up, he can cancel and remove the information of his own lost goods.

### `SystemAdmin`

Namespace: `cn.edu.scnu.lost`

A administator of SCNU-LOST-GOODS system, including super admin, admin and student assistants.

ONLY SystemAdmin CAN DO REVERTING and RETURNING transactions.

## Asset

### `cn.edu.scnu.lost.GoodsAsset`

| Fields Name |  Type  |          | Default |         Description        |
|-------------|:------:|:--------:|:-------:|----------------------------|
| goodsId     | String | required |   None  | ID of goods                |
| owner       | Person | optional |   None  | Owner of goods             |
| picker      | Person | optional |   None  | Who pick this goods        |
| receiver | SystemAdmin | optional | None  | Who goods reverted to      |
| state   | GoodsState | required | 'LOST'  | Statement of goods         |
| type      | GoodsType | required |  None  | Type of goods              |
| subject     | String | optional |   None  | Name of this goods         |
| description | String | optional |   None  | More detial of goods       |
| canceledReason | String | optional | None | Reason why owner canceled  |
| revertedPlace  | String | optional | None  | Place where goods was reverted |
| returnedPlace | String | optional | None  | Place where goods was returned |
| createAt    | DateTime | required | None  | Time of goods is submitted |
| foundAt     | DateTime | optional | None  | Time of goods is found     |
| revertedAt   | DateTime | optional | None  | Time of goods is reverted |
| finishAt    | DateTime | optional | None  | Time of goods is canceled or returned |


### `cn.edu.scnu.lost.WalletAsset`

| Fields Name |   Type  |          | Default |         Description        |
|-------------|:-------:|:--------:|:-------:|----------------------------|
| userId      | String  | required |   None  | User ID of wallet          |
| coin        | Integer | required |    0    | Coin count of wallet       |


## Enumerations

### `cn.edu.scnu.lost.GoodsType`

- `SCNU_ECARD`: SCNU E-Card
- `GZ_UNITOWN_ECARD`: Guangzhou university town E-Card
- `STUDENT_ID_CARD`: Student ID Card
- `TRANSPORT_PASS`: Transport pass, such as Yangchengtong
- `MOBILE_PHONE`: Mobile phone
- `BICYCLE`: Bicycle
- `LAPTOP`: Laptop
- `KEY_PAIR`: Key pair
- `OTHERS`: Other goods

### `cn.edu.scnu.lost.GoodsState`

- `LOST`: This goods is lost
- `FOUND`: This goods is found but not reverted
- `REVERTED`: This goods is reverted and stayed in STUU Station
- `RETURNED`: This goods is returned to its owner
- `CANCELED`: The owner canceled this order

### `cn.edu.scnu.lost.AdminRole`

- `SUPER_ADMIN`: Super admin of this system, such as teacher
- `ADMIN`: Admin of this system, such as leader students
- `ASSISTANT`: People who work in STUU Station and are in charge of reverting and returning

## License

Apache-2.0