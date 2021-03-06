/**
 * Taro request
 * @class RequestTask
 */
import Taro from '@tarojs/taro';
import { RequestConfig } from '../@types';
import LoadingManager from '../loading';
import { Body, ResponseTimeoutBody, ResponseCode } from '../response';
import RequestTaskManager from './RequestTaskManager';

const RequestTask = (config: RequestConfig) => {
  return new Promise((resolve, reject) => {
    if (config.showLoading) {
      LoadingManager.show();
    }
    let abortTimer: undefined | number = undefined;
    const requestTask = Taro.request({
      url: config.url!,
      data: config.data,
      header: {
        'content-type': 'application/json',
        ...config.header,
      },
      method: config.method as any,
      dataType: config.dataType,
      success: (res: any) => {
        if (config.showLoading) {
          LoadingManager.hide();
        }
        abortTimer && clearTimeout(abortTimer);
        RequestTaskManager.popRequest({ url: config.url! });
        resolve(res)
      },
      fail: (err) => {
        if (config.showLoading) {
          LoadingManager.hide();
        }
        abortTimer && clearTimeout(abortTimer);
        RequestTaskManager.popRequest({ url: config.url! });
        reject(err)
      }
    })
    RequestTaskManager.addRequest({
      url: config.url!,
      requestTask,
    });
    if (config.timeout &&
      typeof config.timeout === 'number' &&
      config.timeout > 1000
    ) {
      abortTimer = setTimeout(() => {
        clearTimeout(abortTimer);
        if (config.showLoading) {
          LoadingManager.hide();
        }
        requestTask.abort();
        RequestTaskManager.popRequest({ url: config.url! });
        resolve(new ResponseTimeoutBody(new Body(ResponseCode.TIMEOUT, "网络请求超时", {})));
      }, config.timeout)
    }
  });
}

export default RequestTask;
