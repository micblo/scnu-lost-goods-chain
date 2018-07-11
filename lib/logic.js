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
 * Lose goods transaction processor function.
 * @param {cn.edu.scnu.lost.CreateLostTransaction} tx The sample transaction instance.
 * @transaction
 */
async function createLostTransaction(tx) {  // eslint-disable-line no-unused-vars
  // Add new asset.
  const factory = getFactory();
  const goods = factory.newResource('cn.edu.scnu.lost', 'GoodsAsset', tx.goodsId);
  goods.owner = getCurrentParticipant();
  goods.type = tx.type;
  goods.state = 'LOST';
  goods.subject = tx.subject;
  goods.description = tx.description;
  goods.createAt = new Date();

  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
  // Add the asset in the asset registry.
  await assetRegistry.add(goods);

  // Emit an event for the modified asset.
  let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsLostEvent');
  event.asset = goods;
  emit(event);
}

/**
 * Pick goods transaction processor function.
 * @param {cn.edu.scnu.lost.PickTransaction} tx The sample transaction instance.
 * @transaction
 */
async function pickTransaction(tx) {  // eslint-disable-line no-unused-vars
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
 * @param {cn.edu.scnu.lost.RevertTransaction} tx The sample transaction instance.
 * @transaction
 */
async function revertTransaction(tx) {  // eslint-disable-line no-unused-vars
    if (tx.asset.state !== 'FOUND') {
        throw new Error('Goods\' must be FOUND!');
    }

  	tx.asset.state = 'REVERTED';
    tx.asset.retivedAt = new Date();
  
    const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
    await assetRegistry.update(tx.asset);
  
    let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsRevertedEvent');
    event.asset = tx.asset;
    emit(event);
}


/**
 * Return goods transaction processor function.
 * @param {cn.edu.scnu.lost.ReturnBackTransaction} tx The sample transaction instance.
 * @transaction
 */
async function returnBackTransaction(tx) {  // eslint-disable-line no-unused-vars
    if (tx.asset.state !== 'REVERTED') {
        throw new Error('Goods\' must be REVERTED!');
    }

  	tx.asset.state = 'RETURNED';
    tx.asset.finishAt = new Date();
  
    const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
    await assetRegistry.update(tx.asset);
  
    let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsReturnEvent');
    event.asset = tx.asset;
    emit(event);
}


/**
 * Cancel goods transaction processor function.
 * @param {cn.edu.scnu.lost.CancelTransaction} tx The sample transaction instance.
 * @transaction
 */
async function cancelTransaction(tx) {  // eslint-disable-line no-unused-vars
    if (tx.asset.state !== 'LOST') {
        throw new Error('Goods\' must be LOST!');
    }

  	tx.asset.state = 'CANCELED';
    tx.asset.finishAt = new Date();
  
    const assetRegistry = await getAssetRegistry('cn.edu.scnu.lost.GoodsAsset');
    await assetRegistry.update(tx.asset);
  
    let event = getFactory().newEvent('cn.edu.scnu.lost', 'GoodsCancelEvent');
    event.asset = tx.asset;
    emit(event);
}

