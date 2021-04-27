
// 基地址
const BaseUrl = (baseUrl: string) => (target, p, descriptor): void => {
  if (typeof baseUrl === 'string') {
    if (descriptor) {
      descriptor.value.baseUrl = baseUrl;
    }
  }
}

// 请求头配置
const Headers = (headers: any) => (target, p, descriptor): void => {
  if (typeof headers === 'object') {
      if (descriptor) {
        descriptor.value.headers = Object.assign({}, descriptor.value.headers, headers);
      }
  }
}

// formdata, 一般用于上传文件
export const Multipart = (target, p, descriptor): void => {
  if (descriptor) {
    descriptor.value.headers = {
      ...descriptor.value.headers,
      'Content-Type': 'multipart/form-data'
    };
  }
}

// 表单提交方式
export const FormUrlEncoded = (target, p, descriptor): void => {
  if (descriptor) {
    descriptor.value.headers = {
      ...descriptor.value.headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }
}

// 超时时长
const Timeout = (times: number) => (target, p, descriptor): void => {
  if (typeof times === 'number') {
    if (descriptor) {
      descriptor.value.timeout = times;
    }
  }
}

// "json" | "其他"
const DataType = (type: string) => (target, p, descriptor): void => {
  if (typeof type === 'string') {
    if (descriptor) {
      descriptor.value.dataType = type;
    }
  }
}

// 响应的数据类型: "text" | "arraybuffer"
const ResponseType = (resType: string) => (target, p, descriptor): void => {
  if (typeof resType === 'string') {
    if (descriptor) {
      descriptor.value.resType = resType;
    }
  }
}

// 显示请求 Loading
const Loading = (enableLoging: boolean) => (target, p, descriptor): void => {
  if (descriptor) {
    descriptor.value.showLoading = enableLoging ?? true;
  }
}

// 开启 Mock 模式
const Mock = (target, p, descriptor): void => {
  if (descriptor) {
    descriptor.value.mock = true;
  }
}

export {
  Mock,
  BaseUrl,
  Headers,
  Timeout,
  Loading,
  DataType,
  ResponseType
}
