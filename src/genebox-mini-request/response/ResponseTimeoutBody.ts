/**
 * 超时响应体
 * @class ResponseTimeoutBody
 */
class ResponseTimeoutBody {
  data: {
    status: number;
    msg: string;
    data: any;
  }
  constructor(status: number, msg: string, data: any) {
    this.data.status = status;
    this.data.msg = msg;
    this.data.data = data;
  }
}

export default ResponseTimeoutBody;