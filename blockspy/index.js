/*
BlockSpy Plugin for MetaMask (C) craze3 2020
*/
function containsKey(object, key) {
  return Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase());
}
function auditApi (address) {
  return new Promise(resolve => {
    fetch("https://api.cryptoscamdb.org/v1/addresses", {method: 'GET', redirect: 'follow'})
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        if(result.result) {
          //console.log(result.result);
          //console.log("Length!!! = ", Object.keys(result.result).length);
          //console.log("address in result.result = " + address + " in ", (address in result.result), address);
          let theKey = containsKey(result.result, address);
          if(theKey) {
            //console.log("matching", result.result[theKey]);
            resolve(result.result[theKey]);
          } else{
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        console.log('error', error);
        resolve(false);
      });
  })
}

wallet.onMetaMaskEvent('newUnapprovedTx', async (txMeta) => {
  const { txParams } = txMeta
  const addressIsUntrustworthy = await auditApi(txParams.to)
  //console.log("addressIsUntrustworthy", addressIsUntrustworthy);

  if(addressIsUntrustworthy) {
    wallet.addAddressAudit({
      address: txParams.to,
      auditor: '⚠️ BlockSpy',
      status: 'warning',
      message: (addressIsUntrustworthy[0] && addressIsUntrustworthy[0].description) ? 'The recipient is untrustworthy! ('+addressIsUntrustworthy[0].description+')' : 'The recipient is untrustworthy!',
    });
  } else {
    wallet.addAddressAudit({
      address: txParams.to,
      auditor: '✅ BlockSpy',
      status: 'approval',
      message: 'The recipient is trustworthy.',
    });
  }
})
