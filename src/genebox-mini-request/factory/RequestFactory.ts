import Taro from '@tarojs/taro';
import { InterceptorType } from "../@types";

/**
 * @export
 * @class RequestFactory
 */
export default class RequestFactory {

  public static instance: RequestFactory;

  private baseUrl: string;
  private timeOut: number;
  private loading: boolean;
  private headers: {[key: string]: any};
  private transformResponseFn: Function;

  constructor(baseurl, timeout, headers, loading, transformResponseFn) { 
    this.baseUrl = baseurl;
    this.timeOut = timeout;
    this.headers = headers;
    this.loading = loading;
    this.transformResponseFn = transformResponseFn;
  };

  public setBaseUrl(bUrl: string): void {
    this.baseUrl = bUrl;
  }

  public setTimeout(time: number): void {
    this.timeOut = time;
  }

  public setHeaders(headers: {[key: string]: any}): void {
    this.headers = headers;
  }

  public setTransformResponse(transformReponseFn: Function): void {
    this.transformResponseFn = transformReponseFn;
  }

  public setEnableLoading(enable: boolean): void {
    this.loading = enable;
  }
  
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getTimeout(): number {
    return this.timeOut;
  }

  public getHeaders(): {[key: string]: any} {
    return this.headers;
  }

  public getTransformResponseFn() : Function {
    return this.transformResponseFn;
  }

  public getShowLoading(): boolean {
    return this.loading;
  }
};

/**
 * @export
 * @class RequestBuilder
 */
export class RequestBuilder {
  constructor() {
  }

  private baseurl: string = '';
  private timeout: number = 6000;
  private showLoading: boolean = true;
  private header: {[key: string]: any} = {};
  private transformResponseFn: Function | undefined = undefined;

  baseUrl(url: string): RequestBuilder {
    this.baseurl = url;
    return this;
  }

  timeOut(time: number): RequestBuilder {
    this.timeout = time;
    return this;
  }

  headers(header: {[key: string]: any}): RequestBuilder {
    this.header = header;
    return this;
  }

  addInterceptor(interceptor: InterceptorType): RequestBuilder {
    Taro.addInterceptor(interceptor);
    return this;
  }

  enableLogInterceptor(enable: boolean): RequestBuilder {
    if(enable) {
      Taro.addInterceptor(Taro.interceptors.logInterceptor);
    }
    return this;
  }

  enableTimeoutInterceptor(enable: boolean): RequestBuilder {
    if(enable) {
      Taro.addInterceptor(Taro.interceptors.timeoutInterceptor);
    }
    return this;
  }

  enableLoading(enable: boolean) : RequestBuilder {
    this.showLoading = enable;
    return this;
  }

  transformResponse(res) : RequestBuilder {
    this.transformResponseFn = res;
    return this;
  }

  build = (): RequestFactory => {
    const factory = new RequestFactory(
      this.baseurl,
      this.timeout,
      this.header,
      this.showLoading,
      this.transformResponseFn
    );
    RequestFactory.instance = factory;

    return factory;
  }
}