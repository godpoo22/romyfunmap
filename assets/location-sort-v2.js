const formatDistance = (km) => (km < 1 ? `${Math.round(km * 1000)} 公尺` : `${km.toFixed(1)} 公里`);

// Checked north-region venue coordinates override coarse district-center fallbacks.
const coordinateOverrides = {
  "/taipei/family-attractions/astronomy-museum/": { lat: 25.09586, lng: 121.51623 },
  "/taipei/family-attractions/daan-forest-park/": { lat: 25.03251, lng: 121.53603 },
  "/taipei/family-attractions/hushan-park-6/": { lat: 25.15136, lng: 121.57931 },
  "/taipei/family-attractions/maokong-gondola/": { lat: 24.99888, lng: 121.58253 },
  "/taipei/family-attractions/railway-museum/": { lat: 25.04962, lng: 121.54097 },
  "/taipei/family-attractions/science-education-museum/": { lat: 25.09578, lng: 121.51705 },
  "/taipei/family-attractions/taipei-children-amusement-park/": { lat: 25.09628, lng: 121.51471 },
  "/taipei/family-attractions/taipei-fine-arts-museum/": { lat: 25.07251, lng: 121.52472 },
  "/taipei/family-attractions/taipei-water-park/": { lat: 25.01112, lng: 121.53312 },
  "/taipei/family-attractions/taipei-zoo/": { lat: 24.99874, lng: 121.58211 },
  "/taipei/family-events/astronomy-museum-events/": { lat: 25.09586, lng: 121.51623 },
  "/taipei/family-events/taipei-childrens-month-2026/": { lat: 25.03746, lng: 121.56373 },
  "/taipei/family-events/taipei-family-parks/": { lat: 25.033, lng: 121.5654 },
  "/taipei/family-restaurants/moneyjump/": { lat: 25.061334, lng: 121.57543 },
  "/taipei/family-restaurants/elephant-garden-neihu/": { lat: 25.08364, lng: 121.59174 },
  "/taipei/family-restaurants/beetle-paradise/": { lat: 25.10562, lng: 121.52945 },
  "/taipei/family-restaurants/farm-table/": { lat: 25.02891, lng: 121.51646 },
  "/taipei/family-restaurants/hovii-cafe/": { lat: 25.0338, lng: 121.5432 },
  "/taipei/family-restaurants/journey-kaffe-sunshine/": { lat: 25.07966, lng: 121.57586 },
  "/taipei/family-restaurants/mr-tree-guting/": { lat: 25.02838, lng: 121.52522 },
  "/taipei/family-restaurants/rich-daddy/": { lat: 25.043934, lng: 121.53034 },
  "/taipei/family-restaurants/second-floor-renai/": { lat: 25.03798, lng: 121.53218 },
  "/taipei/family-restaurants/taoji-playtime/": { lat: 25.04703, lng: 121.53266 },

  "/newtaipei/family-attractions/bali-left-bank-park/": { lat: 25.1578, lng: 121.40802 },
  "/newtaipei/family-attractions/gold-museum/": { lat: 25.10864, lng: 121.84304 },
  "/newtaipei/family-attractions/houtong-cat-village/": { lat: 25.08734, lng: 121.82744 },
  "/newtaipei/family-attractions/new-taipei-art-museum/": { lat: 24.95463, lng: 121.35275 },
  "/newtaipei/family-attractions/shifen-old-street/": { lat: 25.04331, lng: 121.77564 },
  "/newtaipei/family-attractions/shifen-waterfall/": { lat: 25.05085, lng: 121.78733 },
  "/newtaipei/family-attractions/shihsanhang-museum/": { lat: 25.15714, lng: 121.40591 },
  "/newtaipei/family-attractions/tamsui-fishermans-wharf/": { lat: 25.18347, lng: 121.41472 },
  "/newtaipei/family-attractions/yehliu-ocean-world/": { lat: 25.20653, lng: 121.69042 },
  "/newtaipei/family-attractions/yingge-ceramics-museum/": { lat: 24.95431, lng: 121.35534 },
  "/newtaipei/family-restaurants/anran-bistro/": { lat: 25.15042, lng: 121.39967 },
  "/newtaipei/family-restaurants/baby-wonderland/": { lat: 25.00474, lng: 121.52444 },
  "/newtaipei/family-restaurants/cowboy-manor/": { lat: 25.2368, lng: 121.4994 },
  "/newtaipei/family-restaurants/doris-forest/": { lat: 25.14052, lng: 121.43171 },
  "/newtaipei/family-restaurants/marutong-funbar/": { lat: 25.00555, lng: 121.45859 },
  "/newtaipei/family-restaurants/tong-guo-shulin/": { lat: 24.99116, lng: 121.42432 },
  "/newtaipei/family-restaurants/tonup-cafe/": { lat: 25.15232, lng: 121.40472 },
  "/newtaipei/family-restaurants/warmnest-16/": { lat: 25.02365, lng: 121.46869 },
  "/newtaipei/family-events/ceramics-family-program/": { lat: 24.95431, lng: 121.35534 },
  "/newtaipei/family-events/gold-museum-series/": { lat: 25.10864, lng: 121.84304 },
  "/newtaipei/family-events/ntcam-family-workshops/": { lat: 24.95463, lng: 121.35275 },

  "/taoyuan/family-attractions/dayou-terrace-park/": { lat: 25.01234, lng: 121.31758 },
  "/taoyuan/family-attractions/fenghe-park/": { lat: 25.00072, lng: 121.28644 },
  "/taoyuan/family-attractions/hutoushan-park/": { lat: 25.00189, lng: 121.33465 },
  "/taoyuan/family-attractions/kuos-museum-yangmei/": { lat: 24.90994, lng: 121.14543 },
  "/taoyuan/family-attractions/land-god-cultural-museum/": { lat: 24.99894, lng: 121.30651 },
  "/taoyuan/family-attractions/qingtang-park/": { lat: 25.01647, lng: 121.21173 },
  "/taoyuan/family-attractions/railway-pavilion/": { lat: 24.95529, lng: 121.22579 },
  "/taoyuan/family-attractions/simbalion-art-studio/": { lat: 24.91316, lng: 121.17186 },
  "/taoyuan/family-attractions/taoyuan-childrens-art-museum/": { lat: 25.01498, lng: 121.20167 },
  "/taoyuan/family-attractions/xpark/": { lat: 25.01429, lng: 121.21425 },
  "/taoyuan/family-restaurants/chappa-zhongli/": { lat: 24.95562, lng: 121.22505 },
  "/taoyuan/family-restaurants/fuwa-kitchen/": { lat: 24.95694, lng: 121.21029 },
  "/taoyuan/family-restaurants/qianlan-ramen/": { lat: 24.9557, lng: 121.2243 },
  "/taoyuan/family-restaurants/simbalion-canteen/": { lat: 24.91316, lng: 121.17186 },
  "/taoyuan/family-restaurants/smile-cafe/": { lat: 24.96871, lng: 121.19843 },
  "/taoyuan/family-restaurants/stay-kids-space/": { lat: 25.01886, lng: 121.29906 },
  "/taoyuan/family-restaurants/weilu-hotpot/": { lat: 24.95954, lng: 121.21961 },
  "/taoyuan/family-restaurants/wen-ding-art-district/": { lat: 25.01756, lng: 121.30087 },
  "/taoyuan/family-restaurants/white-peach-hotpot/": { lat: 25.06023, lng: 121.36574 },
  "/taoyuan/family-events/kuos-diy-workshop/": { lat: 24.90994, lng: 121.14543 },
  "/taoyuan/family-events/land-god-guided-tour/": { lat: 24.99894, lng: 121.30651 },
  "/taoyuan/family-events/railway-pavilion-guided-tour/": { lat: 24.95529, lng: 121.22579 },
  "/taoyuan/family-events/taoyuan-childrens-art-museum-workshop/": { lat: 25.01498, lng: 121.20167 },
  // changhua
  "/changhua/family-attractions/baiguoshan-explore/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/brand-health-museum/": { lat: 24.0569, lng: 120.4322 },
  "/changhua/family-attractions/changhua-natural-ecology-center/": { lat: 24.0738, lng: 120.5478 },
  "/changhua/family-attractions/chengmei-culture-park/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/cookie-school/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/fan-shaped-roundhouse/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/hsing-mai-eggroll/": { lat: 24.0414, lng: 120.408 },
  "/changhua/family-attractions/jwood/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/lukang-folk-museum/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/mizuworld/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/mogu-tribe/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/ribbon-king/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/taiwan-glass-gallery/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-attractions/tianwei-highway-garden/": { lat: 23.9018, lng: 120.5274 },
  "/changhua/family-attractions/xihu-sugar-factory/": { lat: 23.9612, lng: 120.4791 },
  "/changhua/family-events/chengmei-guided-tour/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-events/cookie-diy-workshop/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-events/mizuworld-diy/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-events/mogu-diy/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-events/ribbon-diy-workshop/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-restaurants/aurora-forest/": { lat: 23.9567, lng: 120.5717 },
  "/changhua/family-restaurants/chappa-yuanlin/": { lat: 23.9567, lng: 120.5717 },
  "/changhua/family-restaurants/fleur-de-chine/": { lat: 24.0786, lng: 120.5351 },
  "/changhua/family-restaurants/galaxy-railway/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-restaurants/glass-fairyland/": { lat: 23.9567, lng: 120.5717 },
  "/changhua/family-restaurants/guashan-moon/": { lat: 24.0819, lng: 120.5638 },
  "/changhua/family-restaurants/happy-share/": { lat: 23.8795, lng: 120.5219 },
  "/changhua/family-restaurants/jhu-tang/": { lat: 24.0715, lng: 120.5406 },
  "/changhua/family-restaurants/maze-manor/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-restaurants/mizuworld-cafe/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-restaurants/moli-dream/": { lat: 24.0282, lng: 120.5481 },
  "/changhua/family-restaurants/pig-park-hotpot/": { lat: 24.081, lng: 120.538 },
  "/changhua/family-restaurants/tenway-garden/": { lat: 23.9032, lng: 120.5323 },
  "/changhua/family-restaurants/vena-manor/": { lat: 24.0809, lng: 120.5425 },

  // kaohsiung
  "/kaohsiung/family-attractions/aviation-education-museum/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/buddha-memorial-center/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/chengcing-lake/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/cijin-shell-museum/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/cijin-windmill-park/": { lat: 22.5831, lng: 120.3116 },
  "/kaohsiung/family-attractions/dadong-art-center/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/dadong-wetland-park/": { lat: 22.6253, lng: 120.361 },
  "/kaohsiung/family-attractions/eda-theme-park/": { lat: 22.7307, lng: 120.4042 },
  "/kaohsiung/family-attractions/fengyi-academy/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/gangshan-park/": { lat: 22.7965, lng: 120.2968 },
  "/kaohsiung/family-attractions/hakka-cultural-park/": { lat: 22.6521, lng: 120.3027 },
  "/kaohsiung/family-attractions/hamasen-railway-museum/": { lat: 22.6183, lng: 120.2814 },
  "/kaohsiung/family-attractions/hamasen-railway-park/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/heart-of-love-river/": { lat: 22.6439, lng: 120.3029 },
  "/kaohsiung/family-attractions/jinshihu-butterfly-garden/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/kaohsiung-childrens-museum/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/kaohsiung-music-center/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/kw2/": { lat: 22.6163, lng: 120.2673 },
  "/kaohsiung/family-attractions/main-public-library/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/metropolitan-park/": { lat: 22.731, lng: 120.284 },
  "/kaohsiung/family-attractions/mituo-coast-corridor/": { lat: 22.7788, lng: 120.2455 },
  "/kaohsiung/family-attractions/neiwei-art-center/": { lat: 22.6606, lng: 120.2866 },
  "/kaohsiung/family-attractions/nstm/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/pier-2-art-center/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/qishan-sugar-park/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/shoushan-zoo/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/suzuka-circuit-park/": { lat: 22.5722, lng: 120.3258 },
  "/kaohsiung/family-attractions/weiwuying-metropolitan-park/": { lat: 22.6242, lng: 120.3435 },
  "/kaohsiung/family-attractions/weiwuying-playground/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-attractions/weiwuying/": { lat: 22.6273, lng: 120.3014 },
  "/kaohsiung/family-events/kmfa-art-workshop/": { lat: 22.6694, lng: 120.2818 },
  "/kaohsiung/family-events/kmfa-daily-treasure-map/": { lat: 22.6694, lng: 120.2818 },
  "/kaohsiung/family-events/kmfa-guided-tour/": { lat: 22.6694, lng: 120.2818 },
  "/kaohsiung/family-events/kmfa-storytime-2026/": { lat: 22.6694, lng: 120.2818 },
  "/kaohsiung/family-events/main-library-tour/": { lat: 22.5902, lng: 120.3213 },
  "/kaohsiung/family-events/namasia-firefly-2026/": { lat: 23.2023, lng: 120.7045 },
  "/kaohsiung/family-events/nstm-rainbow-playland/": { lat: 22.6359, lng: 120.3415 },
  "/kaohsiung/family-events/nstm-snow-paradise/": { lat: 22.6359, lng: 120.3415 },
  "/kaohsiung/family-events/taipower-art-festival-2026/": { lat: 22.6724, lng: 120.2834 },
  "/kaohsiung/family-events/toy-revival-festival-2026/": { lat: 22.627, lng: 120.3601 },
  "/kaohsiung/family-events/weiwuying-art-fun-play/": { lat: 22.6096, lng: 120.3434 },
  "/kaohsiung/family-events/weiwuying-creative-workshop/": { lat: 22.6096, lng: 120.3434 },
  "/kaohsiung/family-restaurants/little-meal-esky/": { lat: 22.6631, lng: 120.2968 },
  "/kaohsiung/family-restaurants/zone-cafe-library/": { lat: 22.6146, lng: 120.3038 },

  // pingtung
  "/pingtung/family-attractions/pingtung-county-park/": { lat: 22.6727, lng: 120.4882 },
  "/pingtung/family-attractions/donggang-tuna-park/": { lat: 22.4672, lng: 120.4526 },
  "/pingtung/family-attractions/nanzhou-eco-park/": { lat: 22.4800, lng: 120.4950 },
  "/pingtung/family-attractions/linbian-wax-apple-park/": { lat: 22.4363, lng: 120.5082 },
  "/pingtung/family-attractions/linhou-forest-park/": { lat: 22.5498, lng: 120.5426 },
  "/pingtung/family-attractions/axin-chocolate-farm/": { lat: 22.0091, lng: 120.7320 },
  "/pingtung/family-attractions/lujing-deer-park/": { lat: 22.0200, lng: 120.7300 },
  "/pingtung/family-attractions/nmmba/": { lat: 21.9477, lng: 120.7333 },
  "/pingtung/family-attractions/pingtung-1936-culture/": { lat: 22.6681, lng: 120.4903 },
  "/pingtung/family-attractions/shengli-animal-park/": { lat: 22.6760, lng: 120.4820 },
  "/pingtung/family-attractions/pingtung-library/": { lat: 22.6738, lng: 120.4828 },
  "/pingtung/family-attractions/victory-star-village/": { lat: 22.6781, lng: 120.4797 },
  "/pingtung/family-attractions/dapengwan-boat/": { lat: 22.4580, lng: 120.4610 },
  "/pingtung/family-restaurants/good-day-hotpot/": { lat: 22.6681, lng: 120.4860 },
  "/pingtung/family-restaurants/bunny-manor/": { lat: 22.6095, lng: 120.5709 },
  "/pingtung/family-restaurants/shuiminyang-shrimp/": { lat: 22.7574, lng: 120.4842 },


  // chiayi-city
  "/chiayi-city/family-attractions/chiayi-park-kano/": { lat: 23.4808, lng: 120.4563 },
  "/chiayi-city/family-attractions/beixiang-lake-park/": { lat: 23.4714, lng: 120.4335 },
  "/chiayi-city/family-attractions/fanzigou-park/": { lat: 23.4762, lng: 120.4452 },
  "/chiayi-city/family-attractions/chiayi-culture-park/": { lat: 23.4820, lng: 120.4496 },
  "/chiayi-city/family-attractions/central-plaza-kids/": { lat: 23.4795, lng: 120.4476 },
  "/chiayi-city/family-attractions/ncyu-insect-hall/": { lat: 23.4821, lng: 120.4413 },
  "/chiayi-city/family-restaurants/small-bright-spot/": { lat: 23.4785, lng: 120.4520 },
  "/chiayi-city/family-restaurants/greenhouse-v-cafe/": { lat: 23.4796, lng: 120.4534 },
  "/chiayi-city/family-restaurants/magic-treehouse-restaurant/": { lat: 23.4808, lng: 120.4479 },
  "/chiayi-city/family-restaurants/delan-garden-dining/": { lat: 23.4833, lng: 120.4519 },
  "/chiayi-city/family-restaurants/tmd-bistro/": { lat: 23.4760, lng: 120.4501 },
  "/chiayi-city/family-restaurants/three-rabbits-gelato/": { lat: 23.4789, lng: 120.4513 },

  // chiayi-county
  "/chiayi-county/family-attractions/bantianyan-park/": { lat: 23.4554, lng: 120.5302 },
  "/chiayi-county/family-attractions/dongshi-harbor/": { lat: 23.4594, lng: 120.1510 },
  "/chiayi-county/family-attractions/minsyong-cat-playground/": { lat: 23.5460, lng: 120.4275 },
  "/chiayi-county/family-attractions/unicorn-beetle-farm/": { lat: 23.4077, lng: 120.5211 },
  "/chiayi-county/family-attractions/jinjie-factory-farm/": { lat: 23.5421, lng: 120.4302 },
  "/chiayi-county/family-attractions/khtoy-doll-store/": { lat: 23.5512, lng: 120.4374 },
  "/chiayi-county/family-attractions/npm-south-playground/": { lat: 23.4590, lng: 120.3742 },
  "/chiayi-county/family-attractions/zhuqi-water-park/": { lat: 23.5218, lng: 120.5478 },
  "/chiayi-county/family-attractions/three-pigs-farm/": { lat: 23.5552, lng: 120.4288 },
  "/chiayi-county/family-attractions/zhongpu-pet-village/": { lat: 23.3961, lng: 120.5280 },
  "/chiayi-county/family-attractions/tropic-space-museum/": { lat: 23.4282, lng: 120.4009 },
  "/chiayi-county/family-attractions/xinxin-cement-park/": { lat: 23.4637, lng: 120.5432 },
  "/chiayi-county/family-restaurants/green-farm-restaurant/": { lat: 23.4614, lng: 120.3820 },
  "/chiayi-county/family-restaurants/fontainebleau-cafe/": { lat: 23.6050, lng: 120.4803 },

  // miaoli
  "/miaoli/family-attractions/arwin-rose-garden/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-attractions/flying-cow-ranch/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-attractions/green-ark/": { lat: 24.4102, lng: 120.7705 },
  "/miaoli/family-attractions/longteng-bridge/": { lat: 24.4102, lng: 120.7705 },
  "/miaoli/family-attractions/maolimao-park/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-attractions/mingde-reservoir/": { lat: 24.5743, lng: 120.8871 },
  "/miaoli/family-attractions/nanzhuang-old-street/": { lat: 24.6002, lng: 121.0006 },
  "/miaoli/family-attractions/old-mountain-line-rail-bike/": { lat: 24.4088, lng: 120.7756 },
  "/miaoli/family-attractions/shangshun-theme-world/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-attractions/tai-an-hot-spring-park/": { lat: 24.4716, lng: 121.0795 },
  "/miaoli/family-attractions/shishanpark-zhunnan/": { lat: 24.6904, lng: 120.8788 },
  "/miaoli/family-attractions/wanli-kids-park/": { lat: 24.4404, lng: 120.6476 },
  "/miaoli/family-attractions/toufen-sports-music-park/": { lat: 24.6846, lng: 120.8728 },
  "/miaoli/family-attractions/toufen-balance-bike-park/": { lat: 24.682, lng: 120.875 },
  "/miaoli/family-attractions/sifang-dairy-farm/": { lat: 24.6934, lng: 120.8806 },
  "/miaoli/family-attractions/hobbit-tea-forest/": { lat: 24.5028, lng: 120.7766 },
  "/miaoli/family-attractions/zaozhuang-animal-park/": { lat: 24.5152, lng: 120.9128 },
  "/miaoli/family-attractions/taiyen-tongsiao-salt/": { lat: 24.4658, lng: 120.6756 },
  "/miaoli/family-attractions/atayal-culture-park/": { lat: 24.445, lng: 121.012 },
  "/miaoli/family-attractions/tongsiao-xinsheng-park/": { lat: 24.468, lng: 120.68 },
  "/miaoli/family-attractions/gongguan-kids-park/": { lat: 24.513, lng: 120.91 },
  "/miaoli/family-attractions/houlong-waterway-park/": { lat: 24.6117, lng: 120.7926 },
  "/miaoli/family-attractions/shitan-wenshi-park/": { lat: 24.5736, lng: 120.9706 },
  "/miaoli/family-attractions/tongsiao-pirate-park/": { lat: 24.462, lng: 120.677 },
  "/miaoli/family-attractions/taiwan-hakka-museum/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-attractions/westlake-resort/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-attractions/zhuoye-cottage/": { lat: 24.4102, lng: 120.7705 },
  "/miaoli/family-events/hakka-museum-special-agent-2026/": { lat: 24.4889, lng: 120.7634 },
  "/miaoli/family-events/miaobei-children-series-2026/": { lat: 24.558, lng: 120.8283 },
  "/miaoli/family-events/miaobei-craft-workshop-2026/": { lat: 24.558, lng: 120.8283 },
  "/miaoli/family-events/miaobei-theater-may-2026/": { lat: 24.558, lng: 120.8283 },
  "/miaoli/family-events/miaoli-library-events-2026/": { lat: 24.5588, lng: 120.8201 },
  "/miaoli/family-events/miaoli-tonghwa-festival-2026/": { lat: 24.4752, lng: 120.7561 },
  "/miaoli/family-events/shuangtan-firefly-2026/": { lat: 24.4625, lng: 120.771 },
  "/miaoli/family-events/taiwan-hakka-museum-program/": { lat: 24.4889, lng: 120.7634 },
  "/miaoli/family-events/westlake-season-events/": { lat: 24.4752, lng: 120.7561 },
  "/miaoli/family-restaurants/cloud-land-restaurant/": { lat: 24.4221, lng: 120.8637 },
  "/miaoli/family-restaurants/flying-cow-restaurant/": { lat: 24.4924, lng: 120.684 },
  "/miaoli/family-restaurants/grand-royal-aura-court/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-restaurants/green-ark-restaurant/": { lat: 24.4102, lng: 120.7705 },
  "/miaoli/family-restaurants/jijiu-hall/": { lat: 24.4866, lng: 120.7861 },
  "/miaoli/family-restaurants/lichi-cafe/": { lat: 24.686, lng: 120.913 },
  "/miaoli/family-restaurants/light-garden/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-restaurants/shanwenquan-restaurant/": { lat: 24.4232, lng: 120.8648 },
  "/miaoli/family-restaurants/tonghua-village/": { lat: 24.4086, lng: 120.7726 },
  "/miaoli/family-restaurants/yunshui-forest/": { lat: 24.6035, lng: 121.0163 },
  "/miaoli/family-restaurants/zaozhuang-hakka-restaurant/": { lat: 24.5602, lng: 120.8214 },
  "/miaoli/family-restaurants/zhuoye-restaurant/": { lat: 24.4102, lng: 120.7705 },

  // nantou
  "/nantou/family-attractions/checheng/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-attractions/cingjing-farm/": { lat: 24.0244, lng: 121.1334 },
  "/nantou/family-attractions/conas-castle/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-attractions/jiji-green-tunnel/": { lat: 23.8296, lng: 120.7846 },
  "/nantou/family-attractions/jiji-station/": { lat: 23.8264, lng: 120.7839 },
  "/nantou/family-attractions/jojoban-castle/": { lat: 23.9795, lng: 120.6882 },
  "/nantou/family-attractions/luguo-coffee-farm/": { lat: 23.8961, lng: 120.9354 },
  "/nantou/family-attractions/nine-tribes/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-attractions/paper-dome/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-attractions/puli-winery/": { lat: 23.9642, lng: 120.9695 },
  "/nantou/family-attractions/sun-moon-lake-ropeway/": { lat: 23.8658, lng: 120.9156 },
  "/nantou/family-attractions/sun-moon-tea-factory/": { lat: 23.8961, lng: 120.9354 },
  "/nantou/family-attractions/taomi-park/": { lat: 23.9642, lng: 120.9695 },
  "/nantou/family-attractions/wooden-house/": { lat: 23.9642, lng: 120.9695 },
  "/nantou/family-attractions/kubi-sports-park/": { lat: 23.9734, lng: 120.6831 },
  "/nantou/family-attractions/mingjian-eco-park/": { lat: 23.8134, lng: 120.653 },
  "/nantou/family-attractions/fuxing-spring-park/": { lat: 23.958, lng: 120.976 },
  "/nantou/family-attractions/caotun-kids-park/": { lat: 23.97, lng: 120.688 },
  "/nantou/family-attractions/guoxing-bridge-playground/": { lat: 24.0272, lng: 120.8636 },
  "/nantou/family-attractions/jiujiu-animal-park/": { lat: 24.0093, lng: 120.6859 },
  "/nantou/family-attractions/banshan-dreamworks/": { lat: 23.9097, lng: 120.6832 },
  "/nantou/family-attractions/fenghuang-bird-park/": { lat: 23.7558, lng: 120.7832 },
  "/nantou/family-attractions/star-moon-sky-resort/": { lat: 23.88, lng: 120.93 },
  "/nantou/family-attractions/grandpa-bee-forest/": { lat: 23.9647, lng: 120.9682 },
  "/nantou/family-events/aowanda-night-ecology-2026/": { lat: 23.9265, lng: 121.2271 },
  "/nantou/family-events/danda-bunun-ecocamp-2026/": { lat: 23.6731, lng: 120.9521 },
  "/nantou/family-events/fonghuanggu-museum-day-2026/": { lat: 23.7291, lng: 120.8284 },
  "/nantou/family-events/nantou-firefly-season-2026/": { lat: 23.8623, lng: 120.9119 },
  "/nantou/family-events/nantou-star-season-2026/": { lat: 23.6741, lng: 120.9623 },
  "/nantou/family-events/ntcri-kids-craft-2026/": { lat: 24.0602, lng: 120.6932 },
  "/nantou/family-events/paper-dome-program/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-restaurants/barefoot-fairy/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-restaurants/conas-restaurant/": { lat: 23.9642, lng: 120.9695 },
  "/nantou/family-restaurants/craft-brew-tea/": { lat: 23.8439, lng: 120.7024 },
  "/nantou/family-restaurants/eyeslee/": { lat: 23.9157, lng: 120.6839 },
  "/nantou/family-restaurants/fish-light-bakery/": { lat: 23.8961, lng: 120.9354 },
  "/nantou/family-restaurants/honeycomb-pizza/": { lat: 23.8961, lng: 120.9354 },
  "/nantou/family-restaurants/luguo-cafe/": { lat: 23.8961, lng: 120.9354 },
  "/nantou/family-restaurants/meet-happiness/": { lat: 23.8961, lng: 120.9354 },
  "/nantou/family-restaurants/puli-bubble-house/": { lat: 23.9662, lng: 120.9794 },
  "/nantou/family-restaurants/sunmoon-lake-view/": { lat: 23.8652, lng: 120.9065 },
  "/nantou/family-restaurants/taii-farm/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-restaurants/torii-cafe/": { lat: 23.9609, lng: 120.9719 },
  "/nantou/family-restaurants/wild-cafe/": { lat: 23.8961, lng: 120.9354 },

  // newtaipei
  "/newtaipei/family-attractions/banqiao-435-art-zone/": { lat: 25.0237, lng: 121.4501 },
  "/newtaipei/family-attractions/fulong-beach/": { lat: 25.0171, lng: 121.9448 },
  "/newtaipei/family-attractions/ntpc-metropolitan-park/": { lat: 25.061, lng: 121.4812 },
  "/newtaipei/family-attractions/tamsui-customs-dock-park/": { lat: 25.1705, lng: 121.438 },
  "/newtaipei/family-attractions/wulai-trolley/": { lat: 24.8629, lng: 121.5512 },
  "/newtaipei/family-restaurants/bali-waterfront/": { lat: 25.1529, lng: 121.4066 },
  "/newtaipei/family-restaurants/second-floor-banqiao/": { lat: 25.0118, lng: 121.4638 },

  // taichung
  "/taichung/family-attractions/aofengshan-park/": { lat: 24.2762, lng: 120.5767 },
  "/taichung/family-attractions/beitun-kids-park/": { lat: 24.175, lng: 120.712 },
  "/taichung/family-attractions/calligraphy-greenway/": { lat: 24.149, lng: 120.6625 },
  "/taichung/family-attractions/carton-king/": { lat: 24.1882, lng: 120.725 },
  "/taichung/family-attractions/central-park-flying-melody/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-attractions/cycling-museum/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-attractions/dakeng-fitness-trail/": { lat: 24.1882, lng: 120.725 },
  "/taichung/family-attractions/dali-eco-park/": { lat: 24.093, lng: 120.682 },
  "/taichung/family-attractions/dingyu-liao-park/": { lat: 24.2547, lng: 120.524 },
  "/taichung/family-attractions/dongshi-forest/": { lat: 24.2592, lng: 120.8278 },
  "/taichung/family-attractions/dujiaoxian-park/": { lat: 24.251, lng: 120.836 },
  "/taichung/family-attractions/fengdongshi-park/": { lat: 24.192, lng: 120.775 },
  "/taichung/family-attractions/fengle-sculpture-park/": { lat: 24.119, lng: 120.635 },
  "/taichung/family-attractions/fengshujiao-park/": { lat: 24.126, lng: 120.633 },
  "/taichung/family-attractions/hione-babi-planet/": { lat: 24.1882, lng: 120.725 },
  "/taichung/family-attractions/houfeng-bikeway/": { lat: 24.3153, lng: 120.7345 },
  "/taichung/family-attractions/houli-eco-park/": { lat: 24.342, lng: 120.7 },
  "/taichung/family-attractions/houli-forest-park/": { lat: 24.348, lng: 120.692 },
  "/taichung/family-attractions/houli-horse-ranch/": { lat: 24.3271, lng: 120.7396 },
  "/taichung/family-attractions/isabelle-bakery/": { lat: 24.2257, lng: 120.6471 },
  "/taichung/family-attractions/lihpao-land/": { lat: 24.3095, lng: 120.7225 },
  "/taichung/family-attractions/lixin-park/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-attractions/lvchuan-park/": { lat: 24.127, lng: 120.688 },
  "/taichung/family-attractions/macaron-park/": { lat: 24.126, lng: 120.718 },
  "/taichung/family-attractions/mofia/": { lat: 24.1042, lng: 120.6889 },
  "/taichung/family-attractions/nanxing-park/": { lat: 24.172, lng: 120.706 },
  "/taichung/family-attractions/national-comics-museum/": { lat: 24.1415, lng: 120.6632 },
  "/taichung/family-attractions/national-taichung-theater/": { lat: 24.1626, lng: 120.6402 },
  "/taichung/family-attractions/nlpi/": { lat: 24.1154, lng: 120.6627 },
  "/taichung/family-attractions/nmns/": { lat: 24.1564, lng: 120.6829 },
  "/taichung/family-attractions/okuma-center/": { lat: 24.212, lng: 120.7053 },
  "/taichung/family-attractions/pig-park/": { lat: 24.162, lng: 120.69 },
  "/taichung/family-attractions/qiuhonggu-park/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-attractions/quanyuan-traffic-park/": { lat: 24.1379, lng: 120.7068 },
  "/taichung/family-attractions/rigui-park/": { lat: 24.155, lng: 120.548 },
  "/taichung/family-attractions/shiquan-park/": { lat: 24.142, lng: 120.659 },
  "/taichung/family-attractions/taichung-aquarium/": { lat: 24.265, lng: 120.5233 },
  "/taichung/family-attractions/taichung-broadcasting-station/": { lat: 24.1537, lng: 120.6851 },
  "/taichung/family-attractions/taichung-station-rail-park/": { lat: 24.1369, lng: 120.6867 },
  "/taichung/family-attractions/wenxin-forest-park/": { lat: 24.128, lng: 120.649 },
  "/taichung/family-attractions/woodworking-siblings/": { lat: 24.3095, lng: 120.7225 },
  "/taichung/family-attractions/xinfu-park/": { lat: 24.124, lng: 120.751 },
  "/taichung/family-attractions/yide-mansion/": { lat: 24.1785, lng: 120.6904 },
  "/taichung/family-attractions/yijian-goat-farm/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-attractions/yixiang-new-paradise/": { lat: 24.1042, lng: 120.6889 },
  "/taichung/family-attractions/yuemei-sugar-factory/": { lat: 24.3095, lng: 120.7225 },
  "/taichung/family-attractions/yuliao-sports-park/": { lat: 24.293, lng: 120.527 },
  "/taichung/family-attractions/zhongke-park/": { lat: 24.2257, lng: 120.6471 },
  "/taichung/family-attractions/xunqian-renai-park/": { lat: 24.1398, lng: 120.6741 },
  "/taichung/family-attractions/dajia-tiezhan-park/": { lat: 24.3519, lng: 120.6207 },
  "/taichung/family-attractions/taiping-pinglin-forest-park/": { lat: 24.1329, lng: 120.7389 },
  "/taichung/family-attractions/fengfu-park/": { lat: 24.1476, lng: 120.6573 },
  "/taichung/family-attractions/fengyuan-zhongzheng-park/": { lat: 24.2541, lng: 120.7191 },
  "/taichung/family-attractions/dali-caohu-park/": { lat: 24.0981, lng: 120.6891 },
  "/taichung/family-attractions/miaozi-park/": { lat: 24.1523, lng: 120.6438 },
  "/taichung/family-attractions/yingcai-park/": { lat: 24.1687, lng: 120.6502 },
  "/taichung/family-attractions/hulu-dun-park/": { lat: 24.0762, lng: 120.5381 },
  "/taichung/family-attractions/erhe-park/": { lat: 24.1411, lng: 120.6669 },
  "/taichung/family-attractions/rongquan-park/": { lat: 24.2103, lng: 120.6354 },
  "/taichung/family-attractions/huanzhonglu-bridge-playground/": { lat: 24.1552, lng: 120.6618 },
  "/taichung/family-attractions/wuri-tank-park/": { lat: 24.0714, lng: 120.5913 },
  "/taichung/family-attractions/wuri-riverside-park/": { lat: 24.0698, lng: 120.5847 },
  "/taichung/family-attractions/rende-kids-park/": { lat: 24.1034, lng: 120.6712 },

  // taichung restaurants
  "/taichung/family-restaurants/huidao-jurassic-taichung/": { lat: 24.2539, lng: 120.7228 },
  "/taichung/family-restaurants/leah-cafe-nantun/": { lat: 24.1374, lng: 120.6469 },
  "/taichung/family-restaurants/loveme-playground-taichung/": { lat: 24.1373, lng: 120.6945 },
  "/taichung/family-restaurants/lvduo-farm-longjing/": { lat: 24.0994, lng: 120.5541 },
  "/taichung/family-restaurants/mitang-garden-hotpot/": { lat: 24.2568, lng: 120.7190 },
  "/taichung/family-restaurants/phoenix-hotel-buffet/": { lat: 24.1750, lng: 120.6742 },
  "/taichung/family-restaurants/seasoning-siji-taichung/": { lat: 24.1800, lng: 120.6751 },
  "/taichung/family-restaurants/tianyi-tycafe-houli/": { lat: 24.3157, lng: 120.6970 },
  "/taichung/family-restaurants/touching-camping-dajia/": { lat: 24.3521, lng: 120.6205 },

  // kaohsiung restaurants
  "/kaohsiung/family-restaurants/217-family-restaurant/": { lat: 22.6421, lng: 120.3049 },
  "/kaohsiung/family-restaurants/eda-buffet/": { lat: 22.7339, lng: 120.4108 },
  "/kaohsiung/family-restaurants/ermu-family-restaurant/": { lat: 22.6141, lng: 120.3156 },
  "/kaohsiung/family-restaurants/forest-circus-tangbu/": { lat: 22.7512, lng: 120.2993 },
  "/kaohsiung/family-restaurants/four-liang-shrimp/": { lat: 22.6849, lng: 120.2985 },
  "/kaohsiung/family-restaurants/hanlai-harbor-arena/": { lat: 22.6970, lng: 120.2989 },
  "/kaohsiung/family-restaurants/happy-mama/": { lat: 22.7262, lng: 120.3338 },
  "/kaohsiung/family-restaurants/jingyuan-farm/": { lat: 22.5571, lng: 120.3430 },
  "/kaohsiung/family-restaurants/little-tree-cafe/": { lat: 22.6197, lng: 120.3190 },
  "/kaohsiung/family-restaurants/mary-peach/": { lat: 22.6378, lng: 120.3127 },
  "/kaohsiung/family-restaurants/memphis-family-restaurant/": { lat: 22.6481, lng: 120.3196 },
  "/kaohsiung/family-restaurants/mochi-mochi-kaohsiung/": { lat: 22.6543, lng: 120.2900 },
  "/kaohsiung/family-restaurants/oh-yeah-villa/": { lat: 22.7813, lng: 120.3451 },
  "/kaohsiung/family-restaurants/ourson-cafe/": { lat: 22.6264, lng: 120.3616 },
  "/kaohsiung/family-restaurants/ryan-cafe/": { lat: 22.5947, lng: 120.3210 },
  "/kaohsiung/family-restaurants/sanci-family-restaurant/": { lat: 22.5905, lng: 120.3272 },
  "/kaohsiung/family-restaurants/shuiku-meiguan/": { lat: 22.7813, lng: 120.3451 },
  "/kaohsiung/family-restaurants/sunheyuan-esky/": { lat: 22.6543, lng: 120.2900 },
  "/kaohsiung/family-restaurants/white-lover-container/": { lat: 22.5828, lng: 120.2926 },
  "/kaohsiung/family-restaurants/yuanqi-hotpot/": { lat: 22.6813, lng: 120.2948 },
  "/kaohsiung/family-restaurants/zone-cafe-dadong/": { lat: 22.6218, lng: 120.3600 },
  "/kaohsiung/family-restaurants/zone-cafe-family/": { lat: 22.6218, lng: 120.3600 },

  // miaoli
  "/miaoli/family-attractions/miaoli-feature-pavilion/": { lat: 24.5604, lng: 120.8223 },
  "/miaoli/family-restaurants/nanzhuang-old-street-eatery/": { lat: 24.5949, lng: 120.9574 },

  // nantou
  "/nantou/family-attractions/formosan-aboriginal-culture-village-station/": { lat: 23.8558, lng: 120.9147 },

  // pingtung restaurants
  "/pingtung/family-restaurants/adatribe-wanluan/": { lat: 22.5012, lng: 120.5755 },
  "/pingtung/family-restaurants/glass-sky-linbian/": { lat: 22.4349, lng: 120.5109 },
  "/pingtung/family-restaurants/little-sunny-fangliao/": { lat: 22.3668, lng: 120.5968 },
  "/pingtung/family-restaurants/mrs-rabbit-pingtung/": { lat: 22.6702, lng: 120.4849 },

  // tainan attractions
  "/tainan/family-attractions/bakel-memorial-park/": { lat: 22.9909, lng: 120.2178 },
  "/tainan/family-attractions/shueijiaoshe-park/": { lat: 22.9717, lng: 120.2052 },

  // tainan restaurants
  "/tainan/family-restaurants/8818-pizza-yongkang/": { lat: 23.0347, lng: 120.2554 },
  "/tainan/family-restaurants/baby-dream-castle/": { lat: 23.3064, lng: 120.3133 },
  "/tainan/family-restaurants/cats-cafe/": { lat: 23.0480, lng: 120.1573 },
  "/tainan/family-restaurants/chuju-tainan/": { lat: 22.9988, lng: 120.2041 },
  "/tainan/family-restaurants/cozzi-kitchen/": { lat: 22.9984, lng: 120.2030 },
  "/tainan/family-restaurants/dawo-home/": { lat: 23.1488, lng: 120.3070 },
  "/tainan/family-restaurants/day-by-day-diy/": { lat: 23.0001, lng: 120.2140 },
  "/tainan/family-restaurants/first-place/": { lat: 22.9985, lng: 120.1991 },
  "/tainan/family-restaurants/forest-ride-cafe/": { lat: 23.0181, lng: 120.2163 },
  "/tainan/family-restaurants/mellow-mellow/": { lat: 22.9780, lng: 120.2100 },
  "/tainan/family-restaurants/mochi-mochi-mitsui/": { lat: 22.9601, lng: 120.2968 },
  "/tainan/family-restaurants/relax-brunch/": { lat: 23.0007, lng: 120.2197 },
  "/tainan/family-restaurants/shenyuan-shantang/": { lat: 23.1542, lng: 120.3101 },
  "/tainan/family-restaurants/shuilege/": { lat: 23.0604, lng: 120.1663 },
  "/tainan/family-restaurants/yeting-restaurant/": { lat: 23.0400, lng: 120.2100 },
  "/tainan/family-restaurants/little-muddy-boots/": { lat: 23.1408, lng: 120.3020 },
  "/taichung/family-events/central-park-aviation-center/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-events/dongshi-forest-firefly-2026/": { lat: 24.2521, lng: 120.9083 },
  "/taichung/family-events/kmu-spring-exhibition-2026/": { lat: 24.1538, lng: 120.6679 },
  "/taichung/family-events/mini-center-mothers-day-diy/": { lat: 24.1538, lng: 120.6679 },
  "/taichung/family-events/nmns-ecology-wall/": { lat: 24.1564, lng: 120.6829 },
  "/taichung/family-events/nmns-friday-free-2026/": { lat: 24.1564, lng: 120.6829 },
  "/taichung/family-events/nmns-museum-day-2026/": { lat: 24.1564, lng: 120.6829 },
  "/taichung/family-events/nmns-whale-exhibition/": { lat: 24.1564, lng: 120.6829 },
  "/taichung/family-events/nmns-wildflower-exhibition/": { lat: 24.1564, lng: 120.6829 },
  "/taichung/family-events/ntmofa-children-art-base-2026/": { lat: 24.1469, lng: 120.6621 },
  "/taichung/family-events/ntt-animal-theater-2026/": { lat: 24.1635, lng: 120.6461 },
  "/taichung/family-events/ntt-crying-princess-2026/": { lat: 24.1635, lng: 120.6461 },
  "/taichung/family-events/ntt-music-master-2026/": { lat: 24.1635, lng: 120.6461 },
  "/taichung/family-events/ntt-opera-exploration-2026/": { lat: 24.1635, lng: 120.6461 },
  "/taichung/family-events/taichung-vision-hall/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-restaurants/annie-princess-garden/": { lat: 24.177, lng: 120.815 },
  "/taichung/family-restaurants/apple-castle/": { lat: 24.2521, lng: 120.7224 },
  "/taichung/family-restaurants/avamommy/": { lat: 24.1216, lng: 120.673 },
  "/taichung/family-restaurants/chijiao-farm/": { lat: 24.2257, lng: 120.6471 },
  "/taichung/family-restaurants/cream-hippo/": { lat: 24.1882, lng: 120.725 },
  "/taichung/family-restaurants/feijin-kitchen/": { lat: 24.1925, lng: 120.6038 },
  "/taichung/family-restaurants/geoliam/": { lat: 24.1815, lng: 120.6278 },
  "/taichung/family-restaurants/hihi-taichung/": { lat: 24.1383, lng: 120.6167 },
  "/taichung/family-restaurants/island-aurora/": { lat: 24.1882, lng: 120.725 },
  "/taichung/family-restaurants/meteor-garden/": { lat: 24.2515, lng: 120.772 },
  "/taichung/family-restaurants/our-childhood/": { lat: 24.1882, lng: 120.725 },
  "/taichung/family-restaurants/pear-cafe-chongde/": { lat: 24.1871, lng: 120.6908 },
  "/taichung/family-restaurants/pear-cafe-donghai/": { lat: 24.1835, lng: 120.5935 },
  "/taichung/family-restaurants/wuli-mo/": { lat: 24.2527, lng: 120.722 },
  "/taichung/family-restaurants/xiangwo-11/": { lat: 24.2377, lng: 120.5663 },
  "/taichung/family-restaurants/yiduo-cafe/": { lat: 24.1882, lng: 120.725 },

  // tainan
  "/tainan/family-attractions/anping-tree-house/": { lat: 23.0008, lng: 120.1596 },
  "/tainan/family-attractions/chimei-museum/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/deyang-ship/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/gangbin-history-park/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/golden-coast/": { lat: 22.9293, lng: 120.1518 },
  "/tainan/family-attractions/guangxian-traffic-park/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/he-le-plaza/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/health-oasis-park/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/hutoupi-scenic-area/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/kunxiwan-cultural-park/": { lat: 22.9305, lng: 120.163 },
  "/tainan/family-attractions/nanke-archaeology-museum/": { lat: 23.1186, lng: 120.2798 },
  "/tainan/family-attractions/nanying-astronomical/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/nanying-green-heart-park/": { lat: 23.308, lng: 120.3165 },
  "/tainan/family-attractions/nmth/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/qigu-salt-mountain/": { lat: 23.1545, lng: 120.1009 },
  "/tainan/family-attractions/shanshang-waterworks-museum/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/sicao-green-tunnel/": { lat: 23.0459, lng: 120.1063 },
  "/tainan/family-attractions/sinying-railway-cultural-park/": { lat: 23.3032, lng: 120.3191 },
  "/tainan/family-attractions/siyou-salt-park/": { lat: 23.0028, lng: 120.1532 },
  "/tainan/family-attractions/taijiang-visitor-center/": { lat: 23.0453, lng: 120.1321 },
  "/tainan/family-attractions/tainan-art-museum/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/ten-drum-cultural/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/tree-valley-science/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/wanpi-world/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/yuguang-island/": { lat: 22.9919, lng: 120.1617 },
  "/tainan/family-attractions/zhuxi-riverside-park/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-attractions/zuozhen-fossil-park/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-events/chimei-animal-hall-family-guide/": { lat: 22.9997, lng: 120.227 },
  "/tainan/family-events/deyang-teddy-bear-2026/": { lat: 22.9953, lng: 120.1609 },
  "/tainan/family-events/moyu-aesthetics-2026/": { lat: 23.0041, lng: 120.1595 },
  "/tainan/family-events/nmth-family-program/": { lat: 23.028, lng: 120.2631 },
  "/tainan/family-events/soulangh-art-festival-2026/": { lat: 23.0041, lng: 120.1595 },
  "/tainan/family-events/taijiang-adventure-2026/": { lat: 23.0012, lng: 120.2231 },
  "/tainan/family-events/tainan-living-arts-2026/": { lat: 22.9881, lng: 120.205 },
  "/tainan/family-events/water-town-exhibition-2026/": { lat: 22.9881, lng: 120.205 },
  "/tainan/family-events/xinying-arts-festival-2026/": { lat: 22.9815, lng: 120.1655 },
  "/tainan/family-events/zuozhen-fossil-education/": { lat: 23.0963, lng: 120.5043 },
  "/tainan/family-restaurants/bellini-nanfang/": { lat: 22.9928, lng: 120.2324 },
  "/tainan/family-restaurants/city-cuisine-anping/": { lat: 22.9659, lng: 120.1838 },
  "/tainan/family-restaurants/nudough-restaurant/": { lat: 22.9817, lng: 120.221 },
  "/tainan/family-restaurants/second-floor-tainan/": { lat: 22.9911, lng: 120.2036 },
  "/tainan/family-restaurants/sunberno-nanfang/": { lat: 22.9928, lng: 120.2324 },

  // taipei
  "/taipei/family-attractions/beitou-hot-spring-museum/": { lat: 25.1367, lng: 121.5061 },
  "/taipei/family-attractions/huashan-grassland/": { lat: 25.044, lng: 121.5298 },
  "/taipei/family-attractions/moca-taipei/": { lat: 25.0502, lng: 121.5195 },
  "/taipei/family-attractions/ntm-railway-department/": { lat: 25.0499, lng: 121.5109 },
  "/taipei/family-attractions/tianmu-dream-park/": { lat: 25.1168, lng: 121.5346 },
  "/taipei/family-events/hakka-park-family-course-2026/": { lat: 25.0174, lng: 121.5189 },
  "/taipei/family-events/ntu-holiday-museum-2026/": { lat: 25.0164, lng: 121.534 },
  "/taipei/family-events/puppet-theater-storeroom-2026/": { lat: 25.0468, lng: 121.5625 },
  "/taipei/family-events/railway-museum-kids-experience-2026/": { lat: 25.0479, lng: 121.5728 },
  "/taipei/family-events/tfam-kids-park-exhibition-2026/": { lat: 25.0696, lng: 121.5248 },
  "/taipei/family-events/youth-park-orienteering-2026/": { lat: 25.0278, lng: 121.4979 },
  "/taipei/family-restaurants/gonnaplus-songyan/": { lat: 25.0438, lng: 121.5615 },
  "/taipei/family-restaurants/jbs-diner/": { lat: 25.1178, lng: 121.5318 },
  "/taipei/family-restaurants/second-floor-nangang/": { lat: 25.0523, lng: 121.607 },
  "/taipei/family-restaurants/triple-cafe/": { lat: 25.0799, lng: 121.5758 },

  // taoyuan
  "/taoyuan/family-attractions/leofoo-village/": { lat: 24.8397, lng: 121.186 },
  "/taoyuan/family-attractions/pushin-ranch/": { lat: 24.9187, lng: 121.1452 },
  "/taoyuan/family-attractions/taoyuan-77art-zone/": { lat: 24.9908, lng: 121.3126 },
  "/taoyuan/family-attractions/taoyuan-disaster-education-center/": { lat: 24.9585, lng: 121.2945 },
  "/taoyuan/family-attractions/taoyuan-shrine-park/": { lat: 24.9987, lng: 121.3256 },
  "/taoyuan/family-events/children-drama-workshop-2026/": { lat: 24.9955, lng: 121.2995 },
  "/taoyuan/family-events/confucius-temple-2026/": { lat: 24.9907, lng: 121.3031 },
  "/taoyuan/family-events/iron-rose-caterpillar-2026/": { lat: 24.9933, lng: 121.3007 },
  "/taoyuan/family-events/tonghwa-festival-2026/": { lat: 24.9694, lng: 121.2457 },
  "/taoyuan/family-events/toy-revival-taoyuan-2026/": { lat: 24.9932, lng: 121.2958 },
  "/taoyuan/family-restaurants/second-floor-taoyuan/": { lat: 25.0566, lng: 121.2887 },
  "/changhua/family-attractions/yuanlin-milu-park/": { lat: 23.9578, lng: 120.5709 },
  "/changhua/family-attractions/changhua-kids-park/": { lat: 24.0814, lng: 120.5431 },
  "/changhua/family-attractions/tianzhong-bear-park/": { lat: 23.8588, lng: 120.5274 },
  "/changhua/family-attractions/baguashan-family-zone/": { lat: 24.0742, lng: 120.5469 },
  "/changhua/family-attractions/puyan-sports-park/": { lat: 24.0006, lng: 120.4636 },
  "/changhua/family-attractions/giraffe-leisure-farm/": { lat: 24.005, lng: 120.466 },
  "/changhua/family-attractions/sunmoon-hill-farm/": { lat: 24.098, lng: 120.525 },
  "/changhua/family-attractions/jasmine-huatan-museum/": { lat: 24.0263, lng: 120.538 },
  "/tainan/family-attractions/renan-park/": { lat: 23.0393, lng: 120.1785 },
  "/tainan/family-attractions/dingmei-park/": { lat: 22.9904, lng: 120.197 },
  "/tainan/family-attractions/daen-park/": { lat: 22.9595, lng: 120.2053 },
  "/tainan/family-attractions/yongkang-park7/": { lat: 23.0318, lng: 120.2483 },
  "/tainan/family-attractions/tainan-sports-playground/": { lat: 22.9715, lng: 120.2204 },
  "/tainan/family-attractions/longtan-chacha-park/": { lat: 23.1533, lng: 120.3023 },
  "/tainan/family-attractions/heiqiao-sausage-museum/": { lat: 22.9756, lng: 120.2082 },
  "/tainan/family-attractions/masagou-beach/": { lat: 23.2046, lng: 120.0823 },
  "/taipei/family-attractions/xinsheng-park/": { lat: 25.0529, lng: 121.5315 },
  "/taipei/family-attractions/huabo-butterfly-playground/": { lat: 25.069, lng: 121.5283 },
  "/taipei/family-attractions/qingnian-park/": { lat: 25.0255, lng: 121.5027 },
  "/taipei/family-attractions/dajia-riverside-ocean/": { lat: 25.0779, lng: 121.5403 },
  "/taipei/family-attractions/qiangang-park/": { lat: 25.0978, lng: 121.5161 },
  "/taipei/family-attractions/ntm-fossil-museum/": { lat: 25.0449, lng: 121.512 },
  "/taipei/family-attractions/wenshan-forest-park/": { lat: 24.9934, lng: 121.5722 },
  "/taipei/family-attractions/beitou-fuxing-park/": { lat: 25.1338, lng: 121.4931 },
  "/taipei/family-attractions/nangang-forest-park/": { lat: 25.0542, lng: 121.6046 },
  "/taipei/family-attractions/jiansheng-park/": { lat: 25.0574, lng: 121.5194 },
  "/taipei/family-attractions/tianhe-park/": { lat: 25.0831, lng: 121.5361 },
  "/taipei/family-attractions/cpc-petroleum-museum/": { lat: 25.033, lng: 121.5685 },
  "/newtaipei/family-attractions/xinten-history-park/": { lat: 24.9757, lng: 121.5342 },
  "/newtaipei/family-attractions/linkou-active-park/": { lat: 25.0818, lng: 121.3791 },
  "/newtaipei/family-attractions/xizhi-stargalaxy-park/": { lat: 25.0654, lng: 121.6574 },
  "/newtaipei/family-attractions/zhonghe-linghe-park/": { lat: 24.983, lng: 121.493 },
  "/newtaipei/family-attractions/tucheng-longshan-park/": { lat: 24.975, lng: 121.4437 },
  "/newtaipei/family-attractions/bali-shihsanhang-park/": { lat: 25.1508, lng: 121.4067 },
  "/newtaipei/family-attractions/juming-museum/": { lat: 25.1989, lng: 121.637 },
  "/newtaipei/family-attractions/zhunxiu-farm/": { lat: 25.1008, lng: 121.4333 },
  "/newtaipei/family-attractions/kazz-popcorn-factory/": { lat: 25.1519, lng: 121.3866 },
  "/newtaipei/family-attractions/shuxinfang-wagashi/": { lat: 24.9667, lng: 121.45 },
  "/newtaipei/family-attractions/zhonghe-yuanshan-park/": { lat: 24.998, lng: 121.5003 },
  "/newtaipei/family-attractions/shulin-dongsheng-park/": { lat: 24.9891, lng: 121.433 },
  "/newtaipei/family-attractions/xinzhuang-touqian-park/": { lat: 25.0393, lng: 121.4537 },
  "/newtaipei/family-attractions/yingge-yuanyao-park/": { lat: 24.9517, lng: 121.3498 },
  "/newtaipei/family-attractions/bali-harbor-park/": { lat: 25.1417, lng: 121.4333 },
  "/newtaipei/family-attractions/shiding-handmade-noodle/": { lat: 24.9833, lng: 121.6167 },
  "/newtaipei/family-attractions/luyusong-farm/": { lat: 25.2094, lng: 121.6283 },
  "/newtaipei/family-attractions/vigor-pineapple-factory/": { lat: 25.0833, lng: 121.45 },
  "/newtaipei/family-attractions/sanxia-indigo-dyeing/": { lat: 24.9393, lng: 121.3778 },
  "/taoyuan/family-attractions/bade-rongzhu-park/": { lat: 24.9389, lng: 121.2984 },
  "/taoyuan/family-attractions/pingzhen-sports-park/": { lat: 24.9455, lng: 121.2157 },
  "/taoyuan/family-attractions/longtan-sports-park/": { lat: 24.8688, lng: 121.2165 },
  "/taoyuan/family-attractions/nankan-riverside-park/": { lat: 25.0029, lng: 121.2947 },
  "/taoyuan/family-attractions/shuizhi-theme-park/": { lat: 25.0305, lng: 121.1407 },
  "/taoyuan/family-attractions/qiaohu-dream-park/": { lat: 24.9728, lng: 121.2253 },
  "/taoyuan/family-attractions/yongan-conch-park/": { lat: 25.0027, lng: 121.0735 },
  "/taoyuan/family-attractions/taoyuan-aviation-museum/": { lat: 25.0596, lng: 121.2278 },
  "/taoyuan/family-attractions/taimall-park/": { lat: 25.0575, lng: 121.2695 },
  "/taoyuan/family-attractions/zhongli-culture-park/": { lat: 24.9665, lng: 121.2262 },
  "/taoyuan/family-attractions/daxi-diting-park/": { lat: 24.8811, lng: 121.2873 },
  "/taoyuan/family-attractions/pingzhen-xinshi-park/": { lat: 24.9458, lng: 121.2295 },
  "/taoyuan/family-attractions/taoyuan-yangming-park/": { lat: 24.9929, lng: 121.3012 },
  "/taoyuan/family-attractions/yanping-park/": { lat: 24.9966, lng: 121.3143 },
  "/taoyuan/family-attractions/sheep-world-farm/": { lat: 24.9521, lng: 121.2388 },
  "/taoyuan/family-attractions/snoopy-baseball-park/": { lat: 24.8655, lng: 121.2278 },
  "/taoyuan/family-attractions/xiangyang-farm/": { lat: 25.0436, lng: 121.1232 },
  "/taipei/family-attractions/xiangshan-park/": { lat: 25.0276, lng: 121.5655 },
  "/taipei/family-attractions/beitou-revival-park/": { lat: 25.1298, lng: 121.5059 },
  "/taipei/family-attractions/beitou-changan-park/": { lat: 25.1218, lng: 121.5002 },
  "/taipei/family-attractions/rongxing-garden-park/": { lat: 25.0671, lng: 121.5386 },
  "/taipei/family-attractions/nangang-xinxin-park/": { lat: 25.0576, lng: 121.6077 },
  "/taipei/family-attractions/postal-museum/": { lat: 25.0312, lng: 121.5184 },
  "/taipei/family-attractions/taipei-homeland-education/": { lat: 25.0369, lng: 121.4984 },
  "/taipei/family-attractions/taiwan-insect-museum/": { lat: 25.0298, lng: 121.542 },
  "/taipei/family-attractions/yucheng-whale-park/": { lat: 25.055, lng: 121.6069 },
  "/taipei/family-attractions/dunren-police-park/": { lat: 25.0303, lng: 121.5438 },
  "/taipei/family-attractions/meilun-science-park/": { lat: 25.0953, lng: 121.5203 },
  "/taipei/family-attractions/xinhai-eco-park/": { lat: 24.9975, lng: 121.5625 },
  "/taipei/family-attractions/liugong-treehouse-park/": { lat: 25.028, lng: 121.5694 },
  "/taipei/family-attractions/shanshuilv-eco-park/": { lat: 25.0449, lng: 121.6175 },
  "/taipei/family-attractions/taipei-discovery-center/": { lat: 25.0374, lng: 121.5645 },
  "/taipei/family-attractions/taipei-hakka-park/": { lat: 25.0264, lng: 121.52 },
  "/taipei/family-attractions/qingtiangang-grassland/": { lat: 25.1624, lng: 121.5555 },
  "/taipei/family-restaurants/leyeshi-ximending/": { lat: 25.0433, lng: 121.5054 },
  "/taipei/family-restaurants/hi-kidsroom/": { lat: 25.063, lng: 121.534 },
  "/taipei/family-restaurants/stay-playspace-taipei/": { lat: 25.0494, lng: 121.5677 },
  "/taipei/family-restaurants/home-kitchen-neihu/": { lat: 25.06, lng: 121.5889 },
  "/taipei/family-restaurants/maokong-qingquan-plaza/": { lat: 24.971, lng: 121.5896 },
  "/taipei/family-restaurants/chuanshi-hot-pot/": { lat: 25.0651, lng: 121.5238 },
  "/taipei/family-restaurants/zumu-cafe/": { lat: 25.0537, lng: 121.571 },
  "/taipei/family-restaurants/rumah-taipei/": { lat: 25.1275, lng: 121.5045 },
  "/taipei/family-restaurants/nongshe-farmhouse-cafe/": { lat: 25.0806, lng: 121.5884 },
  "/taipei/family-restaurants/longhou-hot-pot-dunbei/": { lat: 25.0607, lng: 121.5581 },
  "/taipei/family-restaurants/mumuland-wanhua/": { lat: 25.0381, lng: 121.4987 },
  "/taipei/family-restaurants/loveway-veggie-neihu/": { lat: 25.069, lng: 121.5756 },
  "/taipei/family-restaurants/wired-cafe-dazhi/": { lat: 25.077, lng: 121.5526 },
  "/taipei/family-restaurants/notwo-kitchen-daan/": { lat: 25.0342, lng: 121.5482 },
  "/taichung/family-restaurants/mitang-garden-hotpot/": [24.2406, 120.7262],
  "/taichung/family-restaurants/huidao-jurassic-taichung/": [24.251, 120.7223],
  "/taichung/family-restaurants/seasoning-siji-taichung/": [24.1815, 120.6908],
  "/taichung/family-restaurants/touching-camping-dajia/": [24.3458, 120.6212],
  "/taichung/family-restaurants/loveme-playground-taichung/": [24.1363, 120.6852],
  "/taichung/family-restaurants/leah-cafe-nantun/": [24.1382, 120.6574],
  "/taichung/family-restaurants/tianyi-tycafe-houli/": [24.287, 120.6791],
  "/taichung/family-restaurants/lvduo-farm-longjing/": [24.1175, 120.5532],
  "/taichung/family-restaurants/phoenix-hotel-buffet/": [24.1461, 120.6821],
  "/newtaipei/family-restaurants/ourhome-tucheng/": { lat: 25.0006, lng: 121.4449 },
  "/newtaipei/family-restaurants/princess-land-tucheng/": { lat: 25.0014, lng: 121.4519 },
  "/newtaipei/family-restaurants/taiwan-boar-city-linkou/": { lat: 25.0831, lng: 121.3782 },
  "/newtaipei/family-restaurants/jkstudio-linkou/": { lat: 25.0753, lng: 121.3869 },
  "/taoyuan/family-restaurants/nosey-cafe-guishan/": { lat: 25.0633, lng: 121.3597 },
  "/newtaipei/family-restaurants/redbrick-eatery-shulin/": { lat: 24.9891, lng: 121.4355 },
  "/newtaipei/family-restaurants/babywonderland-zhonghe/": { lat: 24.9964, lng: 121.4961 },
  "/newtaipei/family-restaurants/wonder-kitchen-zhonghe/": { lat: 24.9934, lng: 121.4934 },
  "/taoyuan/family-restaurants/cafe4fun-taoyuan/": { lat: 24.9942, lng: 121.2979 },
  "/taoyuan/family-restaurants/hihi-taoyuan/": { lat: 24.9948, lng: 121.299 },
  "/taoyuan/family-restaurants/lala-kitchen-ncu/": { lat: 24.9683, lng: 121.194 },
  "/taoyuan/family-restaurants/nice-to-meet-u-taoyuan/": { lat: 24.9854, lng: 121.2958 },
  "/taoyuan/family-restaurants/no3-cafe-xinwu/": { lat: 24.9768, lng: 121.0726 },
  "/taoyuan/family-restaurants/busu-cafe-longtan/": { lat: 24.8739, lng: 121.2153 },
  "/taoyuan/family-restaurants/xinlin-cafe-xinwu/": { lat: 24.9717, lng: 121.0749 },
  "/taoyuan/family-restaurants/katomili-cafe-xinwu/": { lat: 24.9803, lng: 121.0432 },
};

const geocodeCacheKey = "parenting-site-location-cache-v1";

const cityNameMap = {
  taipei: "台北市",
  newtaipei: "新北市",
  taoyuan: "桃園市",
  taichung: "台中市",
  kaohsiung: "高雄市",
  tainan: "台南市",
  changhua: "彰化縣",
  miaoli: "苗栗縣",
  nantou: "南投縣",
};

const geocodeCache = (() => {
  try {
    return JSON.parse(window.localStorage.getItem(geocodeCacheKey) || "{}");
  } catch {
    return {};
  }
})();

const saveGeocodeCache = () => {
  try {
    window.localStorage.setItem(geocodeCacheKey, JSON.stringify(geocodeCache));
  } catch {
    // Ignore storage failures and continue with in-memory coordinates.
  }
};

const districtPattern = /[・·]([^|｜]+?(?:區|鄉|鎮|市))[|｜]/;

const extractDistrictFromSummary = (summary) => {
  const match = summary.match(districtPattern);
  return match ? match[1].trim() : "";
};

const inferEnvironmentTag = (text) => {
  if (
    /室內|博物館|美術館|圖書館|觀光工廠|餐廳|咖啡|火鍋|拉麵|展示館|文化館|故事館|科學館|城堡|館|室內樂園/.test(text)
  ) {
    return "室內";
  }

  if (
    /戶外|半戶外|公園|農場|牧場|步道|遊戲場|瀑布|碼頭|老街|風景區|湖|糖廠|動物園|蝴蝶園|渡假村|水岸|農創園區|廣場|纜車|書院/.test(text)
  ) {
    return "戶外";
  }

  return "室內";
};

const normalizeListingCards = (grid) => {
  const cards = Array.from(document.querySelectorAll(".modern-card"));

  cards.forEach((card) => {
    const tags = card.querySelectorAll(".tags-row .district-tag");
    if (tags.length < 2) {
      return;
    }

    const title = card.querySelector(".card-title")?.textContent?.trim() || "";
    const summary = card.querySelector(".card-desc")?.textContent?.trim() || "";
    const infoTexts = card.querySelectorAll(".info-list .info-text");
    const typeText = infoTexts[0]?.textContent?.replace(/\s+/g, " ").replace("類型", "").trim() || "";
    const district = extractDistrictFromSummary(summary) || tags[0].textContent.trim();

    if (district) {
      tags[0].textContent = district;
    }

    tags[1].textContent = inferEnvironmentTag(`${tags[1].textContent} ${typeText} ${summary} ${title}`);
  });
};

const distanceBetween = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const buildGeocodeQuery = (card, path) => {
  const segments = path.split("/").filter(Boolean);
  const cityName = cityNameMap[segments[0]] || "";
  const title = card.querySelector(".card-title")?.textContent?.trim() || "";
  const district = card.querySelector(".district-tag")?.textContent?.trim() || "";
  return [title, district, cityName, "台灣"].filter(Boolean).join(" ");
};

// Taiwan bounding box check — avoids accepting wrong geocoding results from other countries
const isInTaiwan = (lat, lng) =>
  lat >= 21.5 && lat <= 26.5 && lng >= 119.0 && lng <= 122.5;

const geocodeByQuery = async (query) => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "tw");
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    return null;
  }

  const results = await response.json();
  const first = results?.[0];

  if (!first) {
    return null;
  }

  const result = {
    lat: Number(first.lat),
    lng: Number(first.lon),
  };

  // Only accept results that are actually within Taiwan
  if (!isInTaiwan(result.lat, result.lng)) {
    return null;
  }

  return result;
};

const getCardCoordinates = async (card) => {
  const actionLink = card.querySelector(".action-btn");
  const path = actionLink
    ? new URL(actionLink.getAttribute("href"), window.location.origin).pathname
    : "";

  if (path) {
    const override = coordinateOverrides[path];
    if (override) {
      return override;
    }
  }

  // If the card already has valid Taiwan coordinates in data-lat/lng, use them directly.
  // This avoids unreliable Nominatim lookups for cards that already have correct data.
  const fallback = {
    lat: Number(card.dataset.lat),
    lng: Number(card.dataset.lng),
  };

  if (isInTaiwan(fallback.lat, fallback.lng)) {
    return fallback;
  }

  // No valid HTML coordinates — try geocoding as last resort
  if (path) {
    // Check cache (only use if result is within Taiwan)
    if (geocodeCache[path] && isInTaiwan(geocodeCache[path].lat, geocodeCache[path].lng)) {
      return geocodeCache[path];
    }

    const query = buildGeocodeQuery(card, path);

    if (query) {
      try {
        const geocoded = await geocodeByQuery(query);

        if (geocoded && Number.isFinite(geocoded.lat) && Number.isFinite(geocoded.lng)) {
          geocodeCache[path] = geocoded;
          saveGeocodeCache();
          return geocoded;
        }
      } catch {
        // Keep graceful fallback.
      }
    }
  }

  return fallback;
};

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("enable-location-btn");
  const grid = document.getElementById("listing-grid");

  if (!button || !grid) {
    return;
  }

  normalizeListingCards(grid);

  button.addEventListener("click", () => {
    if (!navigator.geolocation) {
      window.alert("這個裝置目前不支援定位功能。");
      return;
    }

    button.textContent = "定位中...";

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Collect ALL cards on the page (including cards in secondary sections)
        const cards = Array.from(document.querySelectorAll(".modern-card"));

        // Fetch all coordinates in parallel instead of sequentially
        const coordsData = cards.map((card) => {
          const link = card.querySelector('a.action-btn, a[href]');
          const href = link ? link.getAttribute('href') : '';
          const override = coordinateOverrides[href];
          let lat, lng;
          if (override) {
            if (Array.isArray(override)) {
              lat = override[0];
              lng = override[1];
            } else {
              lat = override.lat;
              lng = override.lng;
            }
          } else {
            lat = Number(card.dataset.lat);
            lng = Number(card.dataset.lng);
          }
          return { card, lat, lng };
        });

        coordsData.forEach(({ card, lat, lng }) => {
          const distanceTag = card.querySelector(".distance-tag");

          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            card.dataset.distance = "9999";
            return;
          }

          const distance = distanceBetween(
            position.coords.latitude,
            position.coords.longitude,
            lat,
            lng
          );

          card.dataset.distance = String(distance);

          if (distanceTag) {
            distanceTag.style.display = "inline-block";
            distanceTag.textContent = formatDistance(distance);
          }
        });

        cards
          .sort((a, b) => Number(a.dataset.distance) - Number(b.dataset.distance))
          .forEach((card) => grid.appendChild(card));

        button.textContent = "已依距離排序";
        button.style.background = "var(--primary)";
        button.style.color = "#fff";
      },
      () => {
        button.textContent = "開啟定位，依我的距離排序";
        window.alert("沒有取得定位權限，頁面維持原本排序。");
      }
    );
  });
});
