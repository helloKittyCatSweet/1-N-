<template>
  <view class="index">
    <!-- ===== 顶部标题 ===== -->
    <view class="page-hero">
      <text class="hero-title">Meme</text>
    </view>

    <!-- ===== 第一排：精选大标签（横向滚动） ===== -->
    <scroll-view class="chips-lg" scroll-x>
      <view
        v-for="t in featuredTags"
        :key="t.key"
        class="chip-lg"
        :class="{ active: activeFeatured === t.key }"
        @tap="onPickFeatured(t)"
      >
        {{ t.label }}
      </view>
    </scroll-view>

    <!-- ===== 瀑布流内容 ===== -->
    <!-- H5：columns 瀑布流 -->
    <!-- #ifdef H5 -->
    <view v-if="filtered.length" class="masonry">
      <view class="masonry-item" v-for="item in filtered" :key="item.guid">
        <view class="card" @tap="goDetail(item)">
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

    <!-- 非 H5：Grid 兜底 -->
    <!-- #ifndef H5 -->
    <view v-if="filtered.length" class="grid">
      <view class="grid-cell" v-for="item in filtered" :key="item.guid">
        <view class="card" @tap="goDetail(item)">
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
    <view v-if="!filtered.length" class="skeleton">
      <view class="s-item" v-for="n in 8" :key="n"></view>
    </view>

    <view class="loadMore">Loading...</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 列表数据
      lists: [
  {
    "id": 1,
    "img_src": "http://localhost:5000/memes/meme_1755849253848.png",
    "img_num": 12,
    "title": "elder people",
    "tag": "landscape"
  },
  {
    "id": 2,
    "img_src": "http://localhost:5000/memes/meme_1755849319925.png",
    "img_num": 8,
    "title": "cuirous men",
    "tag": "food"
  },
  {
    "id": 3,
    "img_src": "http://localhost:5000/memes/meme_1755849350021.png",
    "img_num": 24,
    "title": "twins",
    "tag": "pet"
  },
  {
    "id": 4,
    "img_src": "http://localhost:5000/memes/meme_1755851424826.png",
    "img_num": 6,
    "title": "electric",
    "tag": "city"
  },
  {
    "id": 5,
    "img_src": "http://localhost:5000/memes/meme_1755854327564.png",
    "img_num": 18,
    "title": "kid",
    "tag": "portrait"
  },
  {
    "id": 6,
    "img_src": "http://localhost:5000/memes/meme_1755854079729.png",
    "img_num": 18,
    "title": "couple",
    "tag": "portrait"
  }
],
      fetchPageNum: 1,
      refreshing: false,

      // 分享渠道
      providerList: [],

      // UI：精选标签
      featuredTags: [
        { key: 'fire', label: 'FIRE' },
        { key: 'memes', label: 'MEMES' },
        { key: 'spongebob', label: 'SPONGEBOB MEME' },
        { key: 'crying', label: 'CRYING' },
        { key: 'funny', label: 'FUNNY' },
        { key: 'clever', label: 'CLEVER' },
        { key: 'kekw', label: 'KEKW' },
        { key: 'kermit', label: 'KERMIT' }
      ],
      activeFeatured: 'fire'
    };
  },
  computed: {
    // 过滤：按精选标签
    filtered() {
      if (!this.lists) return [];
      if (this.activeFeatured === 'fire') return this.lists;
      
      return this.lists.filter(item => {
        const tag = (item.tag || '').toLowerCase();
        return tag === this.activeFeatured.toLowerCase();
      });
    }
  },
  // onLoad() {
  //   this.getData();

  //   // 分享渠道（可选）
  //   uni.getProvider({
  //     service: 'share',
  //     success: (e) => {
  //       const arr = [];
  //       for (let i = 0; i < e.provider.length; i++) {
  //         if (e.provider[i] === 'weixin') {
  //           arr.push({ name: '微信好友', id: 'weixin' });
  //           arr.push({ name: '朋友圈', id: 'weixin', type: 'WXSenceTimeline' });
  //         } else if (e.provider[i] === 'qq') {
  //           arr.push({ name: 'QQ', id: 'qq' });
  //         }
  //       }
  //       this.providerList = arr;
  //     }
  //   });
  // },
  // onPullDownRefresh() {
  //   this.refreshing = true;
  //   this.getData();
  // },
  // onReachBottom() {
  //   this.getData();
  // },
  // methods: {
  //   onPickFeatured(t) {
  //     this.activeFeatured = t.key;
  //   },
  //   getData() {
  //     this.lists = this.lists.map(item => ({
  //       ...item,
  //       guid: this.newGuid() + (item.id != null ? item.id : '')
  //     }));
  //     // const page = this.refreshing ? 1 : this.fetchPageNum;
  //     // const url =
  //     //   this.$serverUrl +
  //     //   '/api/picture/posts.php?page=' +
  //     //   page +
  //     //   '&per_page=12';

  //     // uni.request({
  //     //   url,
  //     //   success: (ret) => {
  //     //     if (ret.statusCode !== 200) return;

  //     //     const data = ret.data || [];
  //     //     const list = data.map((item) => {
  //     //       item.guid =
  //     //         this.newGuid() + (item.id != null ? item.id : '');
  //     //       return item;
  //     //     });

  //     //     if (this.refreshing) {
  //     //       this.refreshing = false;
  //     //       uni.stopPullDownRefresh();
  //     //       this.lists = list;
  //     //       this.fetchPageNum = 2;
  //     //     } else {
  //     //       this.lists = this.lists.concat(list);
  //     //       this.fetchPageNum += 1;
  //     //     }
  //     //   }
  //     // });
  //   },
  //   newGuid() {
  //     const s4 = () =>
  //       ((65536 * (1 + Math.random())) | 0)
  //         .toString(16)
  //         .substring(1);
  //     return (
  //       s4() +
  //       s4() +
  //       '-' +
  //       s4() +
  //       '-4' +
  //       s4().substr(0, 3) +
  //       '-' +
  //       s4() +
  //       '-' +
  //       s4() +
  //       s4() +
  //       s4()
  //     ).toUpperCase();
  //   },
  //   goDetail(e) {
  //     uni.navigateTo({
  //       url:
  //         '../detail/detail?data=' +
  //         encodeURIComponent(JSON.stringify(e))
  //     });
  //   },
  //   share(e) {
  //     if (!this.providerList.length) {
  //       uni.showModal({
  //         title: '当前环境无分享渠道!',
  //         showCancel: false
  //       });
  //       return;
  //     }
  //     const itemList = this.providerList.map((v) => v.name);
  //     uni.showActionSheet({
  //       itemList,
  //       success: (res) => {
  //         const prov = this.providerList[res.tapIndex];
  //         uni.share({
  //           provider: prov.id,
  //           scene:
  //             prov.type === 'WXSenceTimeline'
  //               ? 'WXSenceTimeline'
  //               : 'WXSceneSession',
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
/* 页面容器：更宽、更网页化 */
.index{
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  background: #fafafa;
}

/* 标题 */
.page-hero { margin-bottom: 12px; }
.hero-title{
  font-size: 48px;
  font-weight: 800;
  letter-spacing: .2px;
}

/* ===== 第一排：精选大标签（横向滚动） ===== */
.chips-lg{
  margin: 10px 0 14px;
  white-space: nowrap;
}
.chip-lg{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 18px;
  margin-right: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  color: #fff;
  background: #99a8b2;            /* 默认淡灰绿 */
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
  transition: transform .15s ease, filter .15s ease;
}
.chip-lg:nth-child(1){ background:#9bb0b5; }
.chip-lg:nth-child(2){ background:#9db49c; }
.chip-lg:nth-child(3){ background:#9aa0c3; }
.chip-lg:nth-child(4){ background:#8fb0c4; }
.chip-lg:nth-child(5){ background:#9db49c; }
.chip-lg:nth-child(6){ background:#a892a7; }
.chip-lg:nth-child(7){ background:#9aa0c3; }
.chip-lg:nth-child(8){ background:#9db49c; }
.chip-lg.active{ filter: contrast(1.1) brightness(1.02); transform: translateY(-2px); }

/* ===== H5 瀑布流 ===== */
/* #ifdef H5 */
.masonry {
  display: flex;
  flex-direction: column;   
  gap: 24px;                /* 增加卡片间距从16px到24px */
  max-width: 840px;         /* 增加中心宽度从720px到840px */
  margin: 0 auto;          
}

.masonry-item {
  width: 100%;
}

.card {
  background: #fff;
  border-radius: 20px;      /* 增加圆角从16px到20px */
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}
/* #endif */

/* ===== 非 H5：Grid 兜底 ===== */
/* #ifndef H5 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); /* 增加最小宽度从260px到300px */
  gap: 28px;               /* 增加间距从22px到28px */
}

.card {
  position: relative; 
  background: #fff; 
  border-radius: 20px;     /* 增加圆角从18px到20px */
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0,0,0,.08);
}
/* #endif */

/* 两行省略 */
.text-2line{
  display:-webkit-box; -webkit-line-clamp:2; line-clamp:2;
  -webkit-box-orient:vertical; overflow:hidden;
}

/* 骨架 */
.skeleton{
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(260px,1fr));
  gap: 22px; margin-top: 6px;
}
.s-item{
  height: 200px; border-radius:18px;
  background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 37%,#f0f0f0 63%);
  background-size: 400% 100%;
  animation: shine 1.2s ease-in-out infinite;
}
@keyframes shine{ 0%{background-position:100% 0;} 100%{background-position:0 0;} }

.loadMore{ text-align:center; color:#7a7f88; margin-top: 14px; }
</style>
