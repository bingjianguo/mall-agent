
// const targetReg = (/\/industryprod\/mbillexprod\/\d+(\.\d+){2}/);

export function isAssetInteresting( { url, targetReg } ) {

  return targetReg.test(url);
}


export function getAssetRequest( { requestDetail, targetReg }, param = {} ) {
  const { protocol = 'http://', hostname = '127.0.0.1', port = 8000 } = param;
  const { requestOptions } = requestDetail;
  let { path } = requestOptions;
  let newRequestOptions = requestOptions;
  newRequestOptions.hostname = hostname;
  newRequestOptions.port = port;

  const pathArray = path.split(targetReg);

  if (pathArray && pathArray.length>2) {

    let lastPath = pathArray[pathArray.length-1];
    newRequestOptions.path = lastPath;

  }

  newRequestOptions.headers['Access-Control-Allow-Origin'] = '*';
  
  return {
    protocol: protocol,
    requestOptions: newRequestOptions
  };
}

export function getServiceRequest({ requestDetail, serviceTargetReg }, param = {}) {
  const { protocol = 'http://', hostname = '127.0.0.1', port = 8000 } = param;
  const { requestOptions } = requestDetail;
  let { path } = requestOptions;
  let newRequestOptions = requestOptions;
  newRequestOptions.hostname = hostname;
  newRequestOptions.port = port;

  const pathArray = path.split(serviceTargetReg);

  if (pathArray && pathArray.length>1) {
    let lastPath = pathArray[pathArray.length-1];
    newRequestOptions.path = `/${lastPath}`;
  }


  newRequestOptions.headers['Access-Control-Allow-Origin'] = '*';
  
  return {
    protocol: protocol,
    requestOptions: newRequestOptions
  };
}