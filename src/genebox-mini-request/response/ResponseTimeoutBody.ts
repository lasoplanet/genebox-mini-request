/**
 * 超时响应体
 * @class ResponseTimeoutBody
 */
class ResponseTimeoutBody {
  data: Body;
  constructor(body: Body) {
    this.data = body;
  }
}

export class Body {
  status: number;
  msg: string;
  data: any;
  constructor(status: number, msg: string, data: any) {
    this.status = status;
    this.msg = msg;
    this.data = data;
  }
}

export default ResponseTimeoutBody;
