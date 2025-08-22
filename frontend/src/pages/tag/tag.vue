<template>
  <view class="page">
    <!-- ===== 左侧：分类侧边栏（可搜索/可滚动/吸顶） ===== -->
    <view class="sidebar">
      <view class="sidebar-inner">
        <view class="sidebar-title">分类</view>
        <input
          class="sidebar-search"
          v-model="keyword"
          placeholder="搜索分类…"
          confirm-type="search"
        />
        <scroll-view class="sidebar-list" :scroll-y="true">
          <view
            v-for="c in filteredCats"
            :key="c.key"
            class="sidebar-item"
            :class="{ active: c.key === (activeCat && activeCat.key) }"
            @tap="selectCategory(c)"
          >
            <image class="sidebar-icon" :src="c.icon" mode="aspectFill" />
            <text class="sidebar-text">{{ c.type }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- ===== 右侧：主内容（标题 + 瀑布流） ===== -->
    <view class="main">
      <view class="main-header">
        <text class="main-title">{{ activeCat ? activeCat.type : '热门分类' }}</text>
        <text class="main-sub">Pick a vibe ✨</text>
      </view>

      <!-- H5 瀑布流（CSS Columns） -->
      <!-- #ifdef H5 -->
      <view v-if="lists.length" class="masonry">
        <view v-for="item in lists" :key="item.guid" class="masonry-item" @tap="goDetail(item)">
          <view class="card">
            <image class="card-img" :src="item.img_src" mode="widthFix" lazy-load />
            <text class="card-badge">{{ item.img_num }}P</text>
            <view class="card-title text-2line">{{ item.title }}</view>
            <view class="card-actions">
              <view class="card-chip" @tap.stop="share(item)">📤 分享</view>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- 非 H5 平台用 Grid 兜底 -->
      <!-- #ifndef H5 -->
      <view v-if="lists.length" class="grid">
        <view v-for="item in lists" :key="item.guid" class="grid-cell" @tap="goDetail(item)">
          <view class="card">
            <view class="ratio-box">
              <image class="card-img-cover" :src="item.img_src" mode="aspectFill" />
            </view>
            <text class="card-badge">{{ item.img_num }}P</text>
            <view class="card-title text-2line">{{ item.title }}</view>
            <view class="card-actions">
              <view class="card-chip" @tap.stop="share(item)">📤 分享</view>
            </view>
          </view>
        </view>
      </view>
      <!-- #endif -->

      <!-- 空态骨架 -->
      <view v-if="!lists.length" class="skeleton">
        <view class="s-item" v-for="n in 2" :key="n"></view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 左侧分类（示例）
      data: [
        { type: 'frank caprio', id: 1, key: 1, icon: 'https://placehold.co/200x200' },
        { type: 'mykasih', id: 2, key: 2, icon: 'https://placehold.co/200x200' },
        { type: 'sumbangan asas rahmah', id: 3, key: 3, icon: 'https://placehold.co/200x200' },
        { type: 'inter miami vs tigres uanl', id: 4, key: 4, icon: 'https://placehold.co/200x200' },
        { type: 'jay fai bangkok', id: 5, key: 5, icon: 'https://placehold.co/200x200' },
        { type: 'coe prices', id: 6, key: 6, icon: 'https://placehold.co/200x200' },
        { type: 'sbs transit punggol mrt negligence', id: 7, key: 7, icon: 'https://placehold.co/200x200' },
        { type: 'la galaxy vs pachuca', id: 8, key: 8, icon: 'https://placehold.co/200x200' },
        { type: 'grab singapore ride hailing fares glitch', id: 9, key: 9, icon: 'https://placehold.co/200x200' },
        { type: 'yankee', id: 10, key: 10, icon: 'https://placehold.co/200x200' }
      ],
      keyword: '',
      activeCat: null,

      // 右侧列表数据
      lists: [
        // 单条数据（右侧列表每一项）
{
  id: 6,                         // 主键
  img_src: 'http://localhost:5000/memes/meme_1755854079729.png', // 图片地址（可公网访问）
  img_num: 18,                   // 张数，用于显示 badge
  title: 'couple',               // 卡片标题
  tag: 'portrait',               // 分类 key，用于过滤
  type: 'portrait',              // 分类名称，用于接口传参
  guid: 'A1B2C3D4'               // 唯一标识，瀑布流 key 用
},
// // 单条数据（右侧列表每一项）
// {
//   id: 7,                         // 主键
//   img_src: 'http://localhost:5000/memes/meme_1755851424826.png', // 图片地址（可公网访问）
//   img_num: 18,                   // 张数，用于显示 badge
//   title: 'couple',               // 卡片标题
//   tag: 'portrait',               // 分类 key，用于过滤
//   type: 'portrait',              // 分类名称，用于接口传参
//   guid: 'A1B2C3D5'               // 唯一标识，瀑布流 key 用
// }
      ],
      fetchPageNum: 1,
      refreshing: false,
      providerList: []
    };
  },
  computed: {
    filteredCats() {
      const k = (this.keyword || '').trim();
      return k ? this.data.filter(x => x.type.includes(k)) : this.data;
    }
  },
  onLoad() {
    this.activeCat = this.data[0];
    this.resetAndFetch();

    // 分享渠道（可选）
    uni.getProvider({
      service: 'share',
      success: (e) => {
        const arr = [];
        for (let i = 0; i < e.provider.length; i++) {
          if (e.provider[i] === 'weixin') {
            arr.push({ name: '微信好友', id: 'weixin' });
            arr.push({ name: '朋友圈', id: 'weixin', type: 'WXSenceTimeline' });
          } else if (e.provider[i] === 'qq') {
            arr.push({ name: 'QQ', id: 'qq' });
          }
        }
        this.providerList = arr;
      }
    });
  },
  // methods: {
  //   selectCategory(c) {
  //     if ((this.activeCat && this.activeCat.key) === c.key) return;
  //     this.activeCat = c;
  //     // this.resetAndFetch();
  //   },
  //   resetAndFetch() {
  //     this.lists = [];
  //     this.fetchPageNum = 1;
  //     this.getData();
  //   },
  //   getData() {
  //     const page = this.refreshing ? 1 : this.fetchPageNum;
  //     const typeParam = (this.activeCat && this.activeCat.type) || '';
  //     const idParam   = (this.activeCat && this.activeCat.id)   || '';
  //     const url = this.$serverUrl +
  //       `/api/picture/posts.php?page=${page}&per_page=2&type=${encodeURIComponent(typeParam)}&id=${encodeURIComponent(idParam)}`;

  //     // uni.request({
  //     //   url,
  //     //   success: (ret) => {
  //     //     if (ret.statusCode !== 200) return;
  //     //     const data = ret.data || [];
  //     //     const list = data.map(item => {
  //     //       item.guid = this.newGuid() + ((item.id != null ? item.id : '') + '');
  //     //       return item;
  //     //     });
  //     //     if (this.refreshing) {
  //     //       this.refreshing = false; uni.stopPullDownRefresh();
  //     //       this.lists = list; this.fetchPageNum = 2;
  //     //     } else {
  //     //       this.lists = this.lists.concat(list); this.fetchPageNum += 1;
  //     //     }
  //     //   }
  //     // });
  //   },
  //   newGuid() {
  //     const s4 = () => ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
  //     return (s4()+s4()+"-"+s4()+"-4"+s4().substr(0,3)+"-"+s4()+"-"+s4()+s4()+s4()).toUpperCase();
  //   },
  //   goDetail(e) {
  //     const t = e.type || ((this.activeCat && this.activeCat.type) || '');
  //     const i = e.id   || ((this.activeCat && this.activeCat.id)   || '');
  //     uni.navigateTo({ url: '../list/list?type=' + t + '&id=' + i });
  //   },
  //   share(e) {
  //     if (!this.providerList.length) {
  //       uni.showModal({ title: '当前环境无分享渠道!', showCancel: false });
  //       return;
  //     }
  //     const itemList = this.providerList.map(v => v.name);
  //     uni.showActionSheet({
  //       itemList,
  //       success: (res) => {
  //         const prov = this.providerList[res.tapIndex];
  //         uni.share({
  //           provider: prov.id,
  //           scene: prov.type === 'WXSenceTimeline' ? 'WXSenceTimeline' : 'WXSceneSession',
  //           type: 0,
  //           title: 'uni-app模版',
  //           summary: e.title,
  //           imageUrl: e.img_src,
  //           href: 'https://uniapp.dcloud.io'
  //         });
  //       }
  //     });
  //   }
  // }
};
</script>

<style>
/* 标题行：不换行、垂直居中 */
.main-header{
  display: flex;
  align-items: center;     /* 让两段文字在一条水平线上 */
  gap: 10px;
  flex-wrap: nowrap;       /* 🚫 禁止换行 */
}

/* 两段文字都不允许自动换行 */
.main-title,
.main-sub{
  white-space: nowrap;     /* 🚫 禁止换行 */
  line-height: 1.2;
}

/* 如果担心小屏溢出，可以给副标题加省略号（可选） */
.main-sub{
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 布局：左栏 + 右栏，不再只占中间一列 ===== */
.page{
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: grid;
  grid-template-columns: 280px 1fr;  /* 左栏固定，右侧自适应 */
  grid-column-gap: 24px;
  background: #f6f7f8;
}

/* ===== 侧边栏 ===== */
.sidebar-inner{
  position: sticky; top: 72px;
  background: #fff; border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
  padding: 14px; max-height: calc(100vh - 100px);
  display: flex; flex-direction: column;
}
.sidebar-title{ font-size: 16px; font-weight: 800; margin-bottom: 8px; }
.sidebar-search{ height: 36px; border-radius: 10px; padding: 0 12px; background:#f3f4f6; margin-bottom: 10px; font-size: 14px; }
.sidebar-list{ flex: 1; }
.sidebar-item{
  display:flex; align-items:center; gap:10px;
  padding: 8px 6px; border-radius:10px; margin:2px 0;
  transition: background .15s, transform .15s;
}
.sidebar-item:hover{ background:#f8f8f9; }
.sidebar-item.active{ background:#eef2ff; transform: translateX(2px); }
.sidebar-icon{ width:32px; height:32px; border-radius:8px; object-fit:cover; }
.sidebar-text{ font-size:14px; }

/* ===== 右侧头部 ===== */
.main-header{ display:flex; align-items:baseline; gap:10px; margin: 4px 0 12px; }
.main-title{ font-size:24px; font-weight:800; }
.main-sub{ font-size:12px; color:#8a8f98; }

/* ===== H5：瀑布流 ===== */
/* #ifdef H5 */
.masonry{ column-count: 4; column-gap: 18px; }
@media (max-width: 1280px){ .masonry{ column-count: 3; } }
@media (max-width: 920px){ .masonry{ column-count: 2; } }
@media (max-width: 560px){ .masonry{ column-count: 1; } }
.masonry-item{ break-inside: avoid; -webkit-column-break-inside: avoid; margin: 0 0 18px 0; }

.card{ position:relative; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,.06); }
.card-img{ width:100%; height:auto; display:block; }
.card-badge{ position:absolute; left:10px; top:10px; background:rgba(0,0,0,.55); color:#fff; font-size:12px; padding:4px 10px; border-radius:999px; }
.card-title{ font-weight:700; font-size:14px; padding:10px 12px 2px; }
.card-actions{ display:flex; gap:8px; padding:0 12px 12px; }
.card-chip{ background:#f3f4f6; padding:6px 10px; border-radius:999px; font-size:12px; }
/* #endif */

/* ===== 非 H5：Grid 兜底 ===== */
/* #ifndef H5 */
.grid{ display:grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap:18px; }
.grid-cell{ width:100%; }
.ratio-box{ position:relative; height:0; padding-bottom:70%; }
.card-img-cover{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.card{ position:relative; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,.06); }
.card-badge{ position:absolute; left:10px; top:10px; background:rgba(0,0,0,.55); color:#fff; font-size:12px; padding:4px 10px; border-radius:999px; }
.card-title{ font-weight:700; font-size:14px; padding:10px 12px 2px; }
.card-actions{ display:flex; gap:8px; padding:0 12px 12px; }
.card-chip{ background:#f3f4f6; padding:6px 10px; border-radius:999px; font-size:12px; }
/* #endif */

/* 两行省略 */
.text-2line{
  display:-webkit-box; -webkit-line-clamp:2; line-clamp:2;
  -webkit-box-orient:vertical; overflow:hidden;
}

/* 骨架 */
.skeleton{ display:grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap:18px; margin-top:6px; }
.s-item{
  height:180px; border-radius:16px;
  background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 37%,#f0f0f0 63%);
  background-size:400% 100%; animation:shine 1.2s ease-in-out infinite;
}
@keyframes shine{ 0%{background-position:100% 0;} 100%{background-position:0 0;} }

/* 响应式：窄屏隐藏侧栏，改为顶部横向分类 */
@media (max-width: 960px){
  .page{ grid-template-columns: 1fr; grid-row-gap: 14px; padding:16px 12px 28px; }
  .sidebar{ order:-1; }
  .sidebar-inner{ position:static; max-height:none; padding:10px; }
  .sidebar-list{ white-space:nowrap; overflow-x:auto; overflow-y:hidden; display:block; }
  .sidebar-item{ display:inline-flex; margin-right:8px; border:1px solid #eee; padding:6px 8px; background:#fff; }
  .sidebar-icon{ width:28px; height:28px; border-radius:8px; }
}
</style>
