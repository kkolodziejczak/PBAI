class RequestHandler {
  static instance = null;

  static getInstance() {
    if (!RequestHandler.instance) {
      RequestHandler.instance = new RequestHandler();
    }
    return RequestHandler.instance;
  }

  _getHeaders(options, image) {
    let headers = {
      Accept: 'application/json',
      Cache: 'no-cache',
    };
    if (!image) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  _getBody(options, image) {
    const {payload: data} = options;
    if (image) {
      const formData = new FormData();
      return formData;
    }
    let body = '';
    if (data) {
      body = JSON.stringify(data);
    }
    return body;
  }

  _getUrlParams(options) {
    const {params: data} = options;
    if (!data) {
      return '';
    }
    let str = '?';
    let index = 0;
    const length = Object.keys(data).length;
    for (let key in data) {
      ++index;
      str += `${key}=${data[key]}`;
      if (index !== length) {
        str += '&';
      }
    }
    return str;
  }

  async request(method, path, options, image = false) {
    const dev = process.env.NODE_ENV === 'development'; //displaying console logs only on dev
    let request = {
      method: method.toUpperCase(),
      // credentials: 'include',
      // credentials: 'same-origin',
      // mode: 'cors',
      headers: this._getHeaders(options, image),
    };
    let url = path;
    if (method.toUpperCase() !== 'GET') {
      const body = this._getBody(options, image);
      request.body = body === '{}' ? null : body;
    } else {
      url += this._getUrlParams(options);
    }

    dev && console.log('Request -->', {url, request});
    let res = null;
    res = await fetch(url, request);
    const status = res && res.status;
    const resText = res && (await res.text());
    let response = null;
    try {
      if (resText.includes('{') && !resText.includes('html')) {
        response = JSON.parse(resText);
      } else {
        response = resText;
      }
    } catch (e) {
      dev && console.log('Error parsing response: ', {resText});
    }

    dev && console.log('Response <--', {url, status, response});

    // if (status < 200 || status > 300) {
    //   new Error(`Invalid status ${status}`);
    // }
    return {response, status};
  }
}

export {RequestHandler};
