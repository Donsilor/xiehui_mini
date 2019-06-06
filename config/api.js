const ApiRootUrl = 'http://192.168.16.114:88/api/'; // http://www.blog.com:88
const DomainRootUrl = 'http://192.168.16.114:88'; //http://www.blog.com
const QqmapsdkKey = 'EEHBZ-ELQCI-K4XGR-5WXN7-6PM46-FJBZH';

module.exports = {
  ResourceRootUrl: DomainRootUrl, //首页数据接口
  QqmapsdkKey: QqmapsdkKey, // 腾讯地图key

  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口
  AuthLogin: ApiRootUrl + 'passport/we-chat-mini-login', // 微信登录
  FilesUpload: ApiRootUrl + 'files/upload', // 文件上传

  PersonalUserAuth: ApiRootUrl + 'auth/personal', // 个人账号注册申请
  EnterpriseUserAuth: ApiRootUrl + 'auth/enterprise', // 企业账号注册申请
  EnterpriseUserListsUrl: ApiRootUrl + 'enterprise-lists', // 获取公司列表（员工入职需要）
  EnterpriseUserApplyUrl: ApiRootUrl + 'enterprise-user-apply', // 申请加入公司

  UserAuthInfo: ApiRootUrl + 'auth/show', // 获取用户的注册申请信息
  UserInfoUrl: ApiRootUrl + 'me', // 获取用户的注册申请信息
  UserInfoUpdateUrl: ApiRootUrl + 'update-info', // 获取用户的注册申请信息
  UserShareUrl: ApiRootUrl + 'user-share', // 用户分享
  GetPhoneUrl: ApiRootUrl + 'get-phone', // 从微信接口获取手机号

  HelpListUrl: ApiRootUrl + 'get-helps', // 获取帮助列表

  AboutListUrl: ApiRootUrl + 'get-abouts-list', // 获取关于我们列表

  AboutDetailUrl: ApiRootUrl + 'get-abouts-detail', // 获取关于我们列表

  ShopUrl: ApiRootUrl + 'shop', //查询店铺首页内容
  ShopCreateUrl: ApiRootUrl+'shop-create', //创建店铺
  ShopDetailUrl: ApiRootUrl+'shop-detail', //店铺详情
  ShopUpdateUrl: ApiRootUrl + 'shop-edit', //更新店铺
  ShopAllDetailUrl: ApiRootUrl + 'shop-detail-all',//店铺及服务需求详情
  ShopSelectUrl: ApiRootUrl + 'configs/shop-select', //获取店铺下拉内容相关
  ShopListUrl: ApiRootUrl + 'get-shop-list', //查询店铺列表

  ServiceCreateUrl: ApiRootUrl + 'service-create', //发布服务或商品
  ServiceDetailUrl: ApiRootUrl + 'service-detail', //服务详情
  ServiceUpdateUrl: ApiRootUrl + 'service-edit', //更新服务
  ServiceDeleteUrl: ApiRootUrl + 'service-delete', //删除服务
  ServiceChangeStatusUrl: ApiRootUrl + 'service-change-status', //改变服务状态 （上架和下架)
  ServiceListUrl: ApiRootUrl + 'service-list', //获取服务列表
  ServiceViewUrl: ApiRootUrl + 'service-view', //别人查看服务
  MyServiceListUrl: ApiRootUrl + 'my-service-list', //获取会员自己发布的服务列表
  ServiceSelectUrl: ApiRootUrl + 'configs/service-select', //获取服务下拉内容相关

  DemandCreateUrl: ApiRootUrl + 'demand-create', //发布需求
  DemandDetailUrl: ApiRootUrl + 'demand-detail', //需求详情
  DemandUpdateUrl: ApiRootUrl + 'demand-edit', //更新需求
  DemandDeleteUrl: ApiRootUrl + 'demand-delete', //删除需求
  DemandListUrl: ApiRootUrl + 'demand-list', //获取需求列表
  DemandViewUrl: ApiRootUrl + 'demand-view', //别人查看需求
  MyDemandListUrl: ApiRootUrl + 'my-demand-list', //获取会员自己发布的需求列表

  CarteUrl: ApiRootUrl + 'carte', //查询名片首页内容
  CarteCreateUrl: ApiRootUrl + 'carte-create', //创建名片
  CarteDetailUrl: ApiRootUrl + 'carte-detail', //名片详情
  CarteUpdateUrl: ApiRootUrl + 'carte-edit', //更新名片
  CarteSelectUrl: ApiRootUrl + 'configs/carte-select', //获取名片下拉内容相关
  CarteListUrl: ApiRootUrl + 'carte-list', //名片列表

  AttentionUrl: ApiRootUrl + 'attention', // 关注相关操作
  AttentionStatusUrl: ApiRootUrl + 'get-attention-status', // 查看是否关注
  AttentionListUrl: ApiRootUrl + 'get-attention-list', // 关注列表

  IntegralDetail: ApiRootUrl +'integral-detail', // 积分详情
  IntegralRecording: ApiRootUrl + 'integral-recording', // 积分记录
  GetUserIntegral: ApiRootUrl + 'get-user-integral', // 查看用户积分

  CheckInUrl: ApiRootUrl + 'check-in', // 用户签到
  CheckInStatusUrl: ApiRootUrl + 'check-in-status', // 用户签到状态

  CollectionUrl: ApiRootUrl + 'collection', // 收藏
  GetCollectionStatusUrl: ApiRootUrl + 'get-collection-status',// 获取收藏状态
  GetCollectionListUrl: ApiRootUrl + 'get-collection-list',// 获取收藏列表

  OfficeListUrl: ApiRootUrl + 'office-list', // 获取办事处列表

  GetMemberUrl: ApiRootUrl + 'get-member', // 办会员时用户信息
  OrderPayUrl: ApiRootUrl + 'order-pay', // 开通会员
  ChangeUserUrl: ApiRootUrl + 'change-user', // 开通会员

  BrowseListUrl: ApiRootUrl + 'browse-list', // 浏览记录
  BrowseEmptyAllUrl: ApiRootUrl + 'browse-empty-all', // 浏览记录

  AccusaUrl: ApiRootUrl + 'accusa', // 举报

  MapListUrl: ApiRootUrl + 'map-list', //首页轮播

  CitySelectUrl: ApiRootUrl + 'configs/city-select', //获取地区分类

  CommentListUrl: ApiRootUrl + 'comment-list', //评论列表
  CommentPlayUrl: ApiRootUrl + 'comment-play', //评论
  CommentReplyPlayUrl: ApiRootUrl + 'comment-reply-play', //回复
  GetMyCommentsUrl: ApiRootUrl + 'get-my-comments', //收到的评论回复列表
};