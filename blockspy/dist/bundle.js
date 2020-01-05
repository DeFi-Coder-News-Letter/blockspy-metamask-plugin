() => (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function containsKey(object, key) {
  return Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase());
}
function auditApi (address) {
  return new Promise(resolve => {
    //const lastDigit = address.slice(address.length - 1)
    //resolve(Boolean(lastDigit.toLowerCase().match(/[a-f]/)))

    fetch("https://api.cryptoscamdb.org/v1/addresses", {method: 'GET', redirect: 'follow'})
      .then(response => response.text())
      .then(result => {
        result = JSON.parse(result);
        if(result.result) {
          console.log(result.result);
          console.log("Length!!! = ", Object.keys(result.result).length);
          console.log("address in result.result = " + address + " in ", (address in result.result), address);

          let theKey = containsKey(result.result, address);
          if(theKey) {
            console.log("matching", result.result[theKey]);
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
console.log("addressIsUntrustworthy", addressIsUntrustworthy);

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
      message: 'The recipient is trustworthy!',
    });
  }
})

},{}]},{},[1])