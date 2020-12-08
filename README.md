# genebox-mini-request

genebox-mini-request 基于 JS Decorator（AOP）和 Taro 实现的网络请求封装，建立于 Taro 网络请求基础上，对使用方式做了进一步优化。

#### 背景
当前小程序端网络请求模块使用 request utils 统一处理，通过配置请求模块，动态生成 request task，并通过该实例发起请求。额外的 options 配置参数需要单独传入高阶函数，目前仅支持header，超时时长配置。

#### 存在的问题：

```xml
  请求参数配置存在一定局限性，不易扩展
  请求模版的创建增加重复性代码
  请求模版配置与具体使用分离，维护查找不方便
  生成的请求方法不能跟踪定位到具体模版配置
  无法指定多个请求不同的 BASE URL
  请求模块代码耦合较重，扩展代码容易增加测试风险
```

####  优化方案
借鉴 Android Retrofit 的架构实现思想，结合 Mobx，使用 AOP + Decoration 方式对整个请求流程进行优化。

优势：

```xml
  去除请求配置模块，避免重复代码
  分离请求功能，各模块之间职责单一，降低耦合度
  使用装饰器注入方式，将请求配置与业务逻辑分离，高度解耦
  扩展新功能，只需关注请求封装内部代码，无需关注具体业务逻辑
  通过可插拔的方式提供更多的功能可能性，提高可扩展性
  请求配置与具体的业务方法结合，可以直观快捷的查看到具体配置
  提升代码可重用、可复用性，代码无侵入
  抽象响应体，保持对外接口数据一致性
```

#### 核心实现

##### RequestFactory
负责初始化配置，例如BaseURL，超时时长等，该类提供基础配置并分配到具体使用，数据由 RequestBuilder 提供。

##### RequestBuilder
请求配置类，使用建造者模式实现。负责构建请求参数配置，例如BaseURL，超时时长等，并将配置提供给 RequestFactory 。

##### RequestConfig
AOP 实现，提供多种请求配置，例如 Header、Timeout、BaseUrl 等接口。

##### RequestTask
对 Taro Request 的封装，接收来自 RequestTaskService 层传递的 配置参数，并注册给Taro Request，并对外提供Promise实现。
 
##### RequestTaskService
Taro Request 的服务层，接收来自 RequestType 的基础配置参数，并对参数进行整合处理，生成Taro Request 对应的 Config 参数配置

##### RequestType
AOP 实现，提供多种请求方式选择，例如 GET、POST、PUT 等。对并将请求方式中声明的参数与请求方式 method 进行处理，生成 「 { url, method, params } 」结构， 传递到 RequestTaskService 层

#### 功能支持

```xml
  请求方式
  请求头
  请求地址
  请求参数
  拦截器
  请求超时
  Loading 提示
  抽象响应体
  响应数据类型
  中断请求
  请求响应返回值类型
```

#### 使用方式

初始化配置

```typescript
  import { 
    RequestBuilder,
    RequestFactory
  } from "genebox-mini-request";

  const request: RequestFactory = new RequestBuilder()
    .baseUrl("https://static.genebox.cn") // BaseUrl
    .timeOut(666666)                      // 超时时长
    .headers({                            // Header
      platform: 123
    })
    .enableLoading(false)                 // 是否开启 Request Loading
    .addInterceptor(RequestInterceptor)   // 拦截器
    .enableLogInterceptor(true)           // 开启Log日志拦截器，默认关闭
    .enableTimeoutInterceptor(true)       // 开启请求超时拦截器，默认关闭
    .build();

    // setter
    // request.setBaseUrl("");
    // request.setHeaders({});
    // request.setTimeout(6666);
    // request.setEnableLoading(true);
```

参数配置

```typescript
  import {
    GET,
    POST,
    BaseUrl,
    Headers,
    Timeout,
    DataType,
    Loading,
    ResponseType
  } from "genebox-mini-request";

  @Headers({'User-Agent1': 'request'})
  @GET('/static/article/queue_rules.html')
  @POST('/static/article/queue_rules.html')
  @GET('/static/article/queue_rules.html/{ruleId}')
  @GET('/static/article/queue_rules.html/{0}', 'arg')
  @GET({url: '/static/article/queue_rules.html', params: {page: 1}})
  getInfo(res, err) {
      // res => 服务端返回结果：ResponseBody
      // err => 程序异常错误
  }

```

调用传参

```typescript
// Restful Api 
  ApiService.getInfo('ruleId=123456', {
    limit: 20
  });

  // 普通传参
  ApiService.getInfo({
    limit: 20
  })
```

TODO  
```xml
数据缓存 @ApiCache
```

