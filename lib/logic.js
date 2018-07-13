/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */


/**
 * Init user wallet transaction processor function.
 * @param {cn.edu.scnu.lost.InitWalletTransaction} tx
 * @transaction
 */
async function initWalletTransaction() { // eslint-disable-line no-unused-vars
  await initWallet(getCurrentParticipant().getIdentifier());
}

async function initWallet(targetId) { // eslint-disable-line no-unused-vars
  const factory = getFactory();
  const wallet = factory.newResource('cn.edu.scnu.lost', 'WalletAsset', targetId);

  // Add.
  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.WalletAsset');
  await assetRegistry.add(wallet);

  // Emit an event for the added asset.
  let event = getFactory().newEvent('cn.edu.scnu.lost', 'WalletInitEvent');
  event.userId = targetId;
  emit(event);
}

function validateSubmitGoods(goods) {
  // All the SCNU ECARDS HAS A CARD ID
  if (goods.type === 'SCNU_ECARD' && !goods.owner) {
    throw new Error('You must input owner id');
  } else if (goods.type === 'GZ_UNITOWN_ECARD' && !goods.owner && !goods.subject) {
    // All the SCNU ECARDS HAS A CARD ID AND SCHOOL
    throw new Error('You must input owner id or subject');
  } else if (goods.type === 'STUDENT_ID_CARD' && !goods.owner && !goods.subject) {
    // All the STUDENT ID CARD HAS A CARD ID AND SCHOOL
    throw new Error('You must input owner id or subject');
  } else if (goods.type === 'OTHERS' && !goods.subject) {
    // OTHER GOODS MUST INPUT SUBJECT
    throw new Error('You must input subject of found goods');
  }
}

/**
 * Lose goods transaction processor function.
 * @param {cn.edu.scnu.lost.SubmitLostGoodsTransaction} tx
 * @transaction
 */
async function submitLostGoodsTransaction(tx) { // eslint-disable-line no-unused-vars
  const currentParticipant = getCurrentParticipant();
  const factory = getFactory();
  const goods = Object.assign(factory.newResource('cn.edu.scnu.lost', 'GoodsAsset', tx.goodsId), {
    owner: currentParticipant,
    type: tx.type,
    state: 'LOST',
    subject: tx.subject,
    description: tx.description,
    createAt: new Date()
  });

  validateSubmitGoods(goods);

  // Add.
  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  await assetRegistry.add(goods);

  // Emit an event for the added asset.
  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsLostEvent');
  event.asset = goods;
  emit(event);
}

/**
 * Found goods transaction processor function.
 * @param {cn.edu.scnu.lost.SubmitFoundGoodsTransaction} tx
 * @transaction
 */
async function submitFoundGoodsTransaction(tx) { // eslint-disable-line no-unused-vars
  const currentParticipant = getCurrentParticipant();
  const currentTime = new Date();
  const factory = getFactory();
  const goods = Object.assign(factory.newResource('cn.edu.scnu.lost', 'GoodsAsset', tx.goodsId), {
    owner: tx.owner,
    picker: currentParticipant,
    type: tx.type,
    state: 'FOUND',
    subject: tx.subject,
    description: tx.description,
    createAt: currentTime,
    foundAt: currentTime
  });

  validateSubmitGoods(goods);

  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  await assetRegistry.add(goods);

  // Emit an event for the added asset.
  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsFoundEvent');
  event.asset = goods;
  event.picker = goods.picker;
  emit(event);
}

/**
 * Revert goods transaction processor function.
 * @param {cn.edu.scnu.lost.SubmitRevertedGoodsTransaction} tx
 * @transaction
 */
async function submitRevertedGoodsTransaction(tx) { // eslint-disable-line no-unused-vars
  const currentParticipant = getCurrentParticipant();
  const currentTime = new Date();
  const factory = getFactory();
  const goods = Object.assign(factory.newResource('cn.edu.scnu.lost', 'GoodsAsset', tx.goodsId), {
    owner: tx.owner,
    picker: tx.picker,
    receiver: currentParticipant,
    type: tx.type,
    state: 'REVERTED',
    subject: tx.subject,
    description: tx.description,
    revertedPlace: tx.revertedPlace,
    createAt: currentTime,
    revertedAt: currentTime
  });

  validateSubmitGoods(goods);

  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  await assetRegistry.add(goods);

  // Emit an event for the added asset.
  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsRevertedEvent');
  event.asset = goods;
  event.picker = goods.picker;
  emit(event);
}

/**
 * Pick goods transaction processor function.
 * @param {cn.edu.scnu.lost.PickGoodsTransaction} tx
 * @transaction
 */
async function pickGoodsTransaction(tx) { // eslint-disable-line no-unused-vars
  const picker = getCurrentParticipant();

  // Validate
  if (picker.getIdentifier() === tx.asset.owner.getIdentifier()) {
    throw new Error('Goods\' picker can not be same as owner!');
  }
  if (tx.asset.state !== 'LOST') {
    throw new Error('Goods\' must be LOST!');
  }

  // Update the asset with the new value.
  tx.asset.picker = picker;
  tx.asset.state = 'FOUND';
  tx.asset.foundAt = new Date();

  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  // Update the asset in the asset registry.
  await assetRegistry.update(tx.asset);

  // Emit an event for the modified asset.
  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsFoundEvent');
  event.asset = tx.asset;
  event.picker = picker;
  emit(event);
}

/**
 * Revert goods transaction processor function.
 * @param {cn.edu.scnu.lost.RevertGoodsTransaction} tx
 * @transaction
 */
async function revertGoodsTransaction(tx) { // eslint-disable-line no-unused-vars
  if (tx.asset.state !== 'FOUND') {
    throw new Error('Goods\' must be FOUND!');
  }

  const receiver = getCurrentParticipant();

  tx.asset.state = 'REVERTED';
  tx.asset.receiver = receiver;
  tx.asset.revertedPlace = tx.revertedPlace;
  tx.asset.revertedAt = new Date();

  if (tx.picker) tx.asset.picker = tx.picker;

  const goodsAssetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  await goodsAssetRegistry.update(tx.asset);

  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsRevertedEvent');
  event.asset = tx.asset;
  emit(event);

  // Wallet coin update
  const REWARD_COIN = 10;
  const picker = tx.asset.picker;
  if (picker) { // Picker exists
    const pickerId = picker.getIdentifier();
    const walletAssetRegistry = await getAssetRegistry('cn.edu.scnu.lost.WalletAsset');
    const exists = await walletAssetRegistry.exists(pickerId);
    if (!exists) return;
    // Attention! If picker do not create his wallet, we can not init wallet now before increasing coins.

    const wallet = await walletAssetRegistry.get(pickerId);
    const formerCoin = wallet.coin;
    wallet.coin += REWARD_COIN;
    await walletAssetRegistry.update(wallet);

    event = getFactory().newEvent('cn.edu.scnu.lost', 'WalletCoinChangeEvent');
    event.formerCoin = formerCoin;
    event.increment = REWARD_COIN;
    event.nowCoin = wallet.coin;
    event.userId = pickerId;
    event.reason = `${pickerId} ID='${tx.asset.goodsId}' goods is reverted, reward ${event.increment} coins`;
    emit(event);
  }
}


/**
 * Return goods transaction processor function.
 * @param {cn.edu.scnu.lost.ReturnBackTransaction} tx The sample transaction instance.
 * @transaction
 */
async function returnBackTransaction(tx) { // eslint-disable-line no-unused-vars
  if (tx.asset.state !== 'REVERTED') {
    throw new Error('Goods\' must be REVERTED!');
  }

  const formerOwner = tx.asset.owner;
  if (tx.owner) {
    tx.asset.owner = tx.owner;
  }
  tx.asset.state = 'RETURNED';
  tx.asset.returnedPlace = tx.returnedPlace;
  tx.asset.finishAt = new Date();

  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  await assetRegistry.update(tx.asset);

  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsReturnEvent');
  event.asset = tx.asset;
  if (tx.owner) {
    event.formerOwner = formerOwner;
    event.newOwner = tx.owner;
  }
  emit(event);

  // Wallet coin update
  const REWARD_COIN = 90;
  const picker = tx.asset.picker;
  if (picker) { // Picker exists
    const pickerId = picker.getIdentifier();
    const walletAssetRegistry = await getAssetRegistry('cn.edu.scnu.lost.WalletAsset');
    const exists = await walletAssetRegistry.exists(pickerId);
    if (!exists) return;
    // Attention! If picker do not create his wallet, we can not init wallet now before increasing coins.

    const wallet = await walletAssetRegistry.get(pickerId);
    const formerCoin = wallet.coin;
    wallet.coin += REWARD_COIN;
    await walletAssetRegistry.update(wallet);

    event = getFactory().newEvent('cn.edu.scnu.lost', 'WalletCoinChangeEvent');
    event.formerCoin = formerCoin;
    event.increment = REWARD_COIN;
    event.nowCoin = wallet.coin;
    event.userId = pickerId;
    event.reason = `${pickerId} ID='${tx.asset.goodsId}' goods is returned, reward ${event.increment} coins`;;
    emit(event);
  }
}


/**
 * Cancel goods transaction processor function.
 * @param {cn.edu.scnu.lost.CancelTransaction} tx The sample transaction instance.
 * @transaction
 */
async function cancelTransaction(tx) { // eslint-disable-line no-unused-vars
  if (tx.asset.state !== 'LOST') {
    throw new Error('Goods\' must be LOST!');
  }

  tx.asset.state = 'CANCELED';
  tx.asset.canceledReason = tx.reason;
  tx.asset.finishAt = new Date();

  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  await assetRegistry.update(tx.asset);

  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsCancelEvent');
  event.asset = tx.asset;
  event.reason = tx.reason;
  emit(event);
}
