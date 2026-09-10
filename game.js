const KEY="seventh-district-v02";
const fresh=()=>({page:"home",time:"06:30",day:1,happiness:97,loyalty:83,anomaly:0,location:"home",inventory:[],evidence:[],facts:[],emotionAttempts:0,flags:{intro:false,emotion:false,news:false,archive:false,child:false,pierUnlocked:false,pierVisited:false,photo:false,video:false,camera:false,intervention:false,ending:null}});
let state=JSON.parse(localStorage.getItem(KEY)||"null")||fresh();
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function clamp(x){return Math.max(0,Math.min(100,x))}
function stats(h=0,l=0,a=0){state.happiness=clamp(state.happiness+h);state.loyalty=clamp(state.loyalty+l);state.anomaly=clamp(state.anomaly+a);save()}
function ev(x){if(!state.evidence.includes(x))state.evidence.push(x);save()}
function inv(x){if(!state.inventory.includes(x))state.inventory.push(x);save()}
function fact(x){if(!state.facts.includes(x))state.facts.push(x);save()}
function clock(m){state.time=String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");save()}
function go(p){state.page=p;render()}
function button(t,a,disabled=false){return `<button ${disabled?"disabled":""} onclick="${a}">${t}</button>`}
function bar(){return `<div class="stats"><span>幸福 ${state.happiness}</span><span>忠诚 ${state.loyalty}</span><span class="anomaly">异常 ${state.anomaly}</span></div>`}
function dialog(t,b,a){screen.innerHTML=`<div class="dialog"><div class="eyebrow">CIVIC OS / ${state.time}</div><h2>${t}</h2><div class="dialog-body">${b}</div><div class="actions">${a||""}</div></div>`}
function civic(){return `<div class="civic-shell"><div class="civic-brand"><img src="assets/ui/civic-os-128.png"><div><small>CIVIC OPERATING SYSTEM</small><h2>CIVIC OS</h2><p>公民终端 · ${state.time}</p></div><em>● ${state.anomaly>=40?"需注意":"正常"}</em></div><div class="civic-notice"><span>今日公民状态</span><b>幸福度 ${state.happiness}%</b><small>忠诚度 ${state.loyalty}% · 异常值 ${state.anomaly}%</small></div><div class="civic-grid">${app("▤","新闻","今日资讯","go('news')")}${app("⌖","城市地图","公共区域","go('map')")}${app("▥","居民档案","C-0817","go('files')")}${app("◇","事实整理","已发现 "+state.facts.length,"go('facts')")}${app("▣","影像资料",state.inventory.length?"有资料":"暂无","act('photos')")}${app("⚙","系统状态",state.anomaly>=40?"需要注意":"运行正常","act('system')")}</div><div class="civic-home-message">${state.anomaly>=60?"⚠ 您正在查看不必要的信息。":"请保持幸福。请保持正常。请相信 CIVIC OS。"}</div><div class="start-strip">${button("开始今日生活","act('start')")}</div><footer><span>TERMINAL C-0817</span><span>版本 4.7.1</span><span>● 已同步</span></footer></div>`}
function app(i,t,s,a){return `<button class="civic-app" onclick="${a}"><span class="civic-icon">${i}</span><b>${t}</b><small>${s}</small></button>`}
function render(){if(state.page==="home")screen.innerHTML=civic();else if(state.page==="map")map();else if(state.page==="news")news();else if(state.page==="files")files();else if(state.page==="facts")facts();save()}
function map(){screen.innerHTML=`<div class="page"><div class="page-head"><h2>城市地图</h2>${bar()}</div><div class="map-wrap"><img src="assets/scenes/map.png" class="scene-img"><button class="hotspot home" onclick="act('residential')">幸福住宅区</button><button class="hotspot center" onclick="act('center')">公民服务中心</button><button class="hotspot square" onclick="act('square')">市政广场</button><button class="hotspot pier ${state.flags.pierUnlocked?"open":"locked"}" onclick="act('${state.flags.pierUnlocked?"pier":"pierLocked"}')">${state.flags.pierUnlocked?"第七码头":"？？？"}</button></div><p class="system-note">${state.flags.pierUnlocked?"20:00 · 地图新增地点。":"系统地图：所有公共区域均可安全访问。"}</p></div>`}
function news(){screen.innerHTML=`<div class="page"><div class="page-head"><h2>今日新闻</h2>${bar()}</div><div class="paper"><img src="assets/evidence/newspaper.png"></div><div class="card"><b>城市日报</b><p>今日城市运行正常。没有需要公民担忧的事件。</p>${state.flags.news?"<p class='warning'>画面记录：一名男子于 08:13 被带离公共区域。</p>":""}</div>${button("观看/核对新闻","act('watchNews')")} ${button("返回","go('home')")}</div>`}
function files(){screen.innerHTML=`<div class="page"><div class="page-head"><h2>居民档案</h2>${bar()}</div><div class="file-view"><img src="assets/evidence/resident-file.png"></div><div class="card"><b>C-0817 / 公民记录</b><p>状态：正常公民</p><p>昨日活动：幸福住宅区 → 公民服务中心</p>${state.flags.archive?"<p class='warning'>⚠ 历史版本：C-0817 曾于 20:14 在第七码头签到。</p>":""}</div>${button("查看/重新检查","act('archive')")} ${button("返回","go('home')")}</div>`}
function facts(){const n={news:"新闻画面",community:"社区记录",missing:"失踪人员名单",photo:"旧照片",ticket:"第七码头票据",video:"C-0817录像",note:"警告纸条",child:"儿童地图"};screen.innerHTML=`<div class="page"><div class="page-head"><h2>事实整理</h2>${bar()}</div><p class="muted">不要相信任何单独的记录。把互相矛盾的资料放在一起。</p><div class="evidence-grid">${state.evidence.map(x=>`<div class="evidence"><small>${x}</small><b>${n[x]||x}</b></div>`).join("")||"<div class='card'>尚未发现证据。</div>"}</div><div class="card"><b>重建线索</b><p>${state.evidence.includes("news")&&state.evidence.includes("community")?"新闻与社区记录：官方叙事存在缺口。":""}</p><p>${state.evidence.includes("photo")&&state.evidence.includes("video")?"照片与录像：你的档案可能被修改过。":""}</p>${state.evidence.length>=2?button("组合证据","act('reconstruct')"):""}</div></div>`}
function act(a){switch(a){
case"start":clock(402);state.flags.intro=true;fact("情绪记录");dialog("早晨 06:42","CIVIC OS：请选择今日情绪。<br><br>系统建议：<b>幸福</b>。",button("幸福","act('happy')")+" "+button("平静","act('calm')")+" "+button("满足","act('satisfied')")+" "+button("其他","act('other')",true));break;
case"happy":state.flags.emotion=true;stats(2,1);dialog("情绪已记录","感谢您的诚实。请保持这种状态。",button("继续","go('map')"));break;
case"calm":state.flags.emotion=true;stats(0,1,1);dialog("情绪已记录","系统检测到轻微偏差。无需担心。",button("继续","go('map')"));break;
case"satisfied":state.flags.emotion=true;stats(1,2);dialog("情绪已记录","优秀。您的情绪与城市保持一致。",button("继续","go('map')"));break;
case"other":state.emotionAttempts++;stats(0,-1,3);if(state.emotionAttempts>=7)ending("拒绝被定义","你不必幸福。你不必正常。你也不必被定义。");else dialog("异常输入","“其他”不是可接受的情绪。",button("重新选择","act('start')"));break;
case"residential":clock(430);dialog("幸福住宅区","请选择要查看的地方。",button("林阿姨","act('lin')")+" "+button("信箱","act('mailbox')")+" "+button("电视","act('tv')")+" "+button("返回地图","go('map')"));break;
case"lin":ev("community");stats(0,0,3);dialog("林阿姨","“第七码头？这里没有那个地方呀。你是不是记错了？”<br><br>她停顿：“……我刚才说什么了？”",button("询问","act('linMore')")+" "+button("离开","go('map')"));break;
case"linMore":fact("林阿姨记忆矛盾");dialog("林阿姨","“我以前好像见过一个码头。”<br>“不，不可能。”",button("记下","go('facts')"));break;
case"mailbox":ev("note");stats(0,-1,4);dialog("信箱","纸条：<br><br><b>不要去第七码头。</b><br><br>背面印着 CIVIC OS 校验编号。",button("保留","act('keepNote')")+" "+button("丢弃","act('discardNote')"));break;
case"keepNote":inv("第七码头纸条");fact("警告纸条");dialog("已保存","证据已加入本地档案。",button("返回","go('map')"));break;
case"discardNote":stats(2,2,-3);dialog("已丢弃","你决定相信系统。",button("返回","go('map')"));break;
case"tv":state.flags.news=true;ev("news");fact("新闻矛盾");stats(-1,-1,3);dialog("电视新闻","“今日城市没有任何令人担忧的事件。”<br><br>画面右下角却有一名男子被带离。",button("保存画面","go('news')"));break;
case"watchNews":state.flags.news=true;ev("news");fact("新闻矛盾");stats(-1,-1,2);go("news");break;
case"center":clock(510);dialog("公民服务中心","工作人员：“今天第一次来这里吗？”<br><br>终端却显示：<b>你已于 08:13 签到。</b>",button("查看档案","act('archive')")+" "+button("离开","go('map')"));break;
case"archive":state.flags.archive=true;ev("missing");ev("community");fact("档案冲突");stats(0,-2,7);dialog("居民档案","当前记录：C-0817 从未去过第七码头。<br><br>历史版本：C-0817 于 20:14 在第七码头签到。<br><br>⚠ 您正在查看不必要的信息。",button("继续","act('archiveDeep')")+" "+button("停止","go('files')"));break;
case"archiveDeep":ev("video");stats(0,-1,6);dialog("编辑记录","删除原因：<b>避免造成不必要的焦虑。</b><br>操作者：C-0817",button("返回事实整理","go('facts')"));break;
case"square":clock(900);dialog("市政广场","宣传屏幕：<b>正常生活，就是幸福生活。</b><br><br>一个孩子把手绘地图递给你。",button("查看地图","act('child')")+" "+button("离开","go('map')"));break;
case"child":state.flags.child=true;ev("child");stats(0,-1,5);dialog("诺亚的地图","地图上被涂黑的地点：<b>第七码头</b>。<br><br>“晚上八点以后，那里才会出现。”",button("记住","act('unlock')"));break;
case"unlock":state.flags.pierUnlocked=true;clock(1200);dialog("地图更新","20:00。<br>城市地图新增地点：<b>第七码头</b>。",button("前往地图","go('map')"));break;
case"pierLocked":dialog("系统提示","地图数据库中不存在“第七码头”。<br>建议：不要继续搜索。",button("返回","go('map')"));break;
case"pier":clock(1214);state.flags.pierVisited=true;stats(-3,-3,14);dialog("第七码头","海边仓库没有灯。你找到编号为 <b>C-0817</b> 的储物柜。",button("打开储物柜","act('locker')"));break;
case"locker":state.flags.photo=true;ev("photo");ev("ticket");dialog("储物柜 C-0817","<img class='evidence-photo' src='assets/evidence/abnormal-photo.png'><br>照片背面：<b>“如果你看到这张照片，说明你已经忘记了。”</b><br><br>旁边还有一张第七码头票据。",button("播放录像","act('video')"));break;
case"video":state.flags.video=true;ev("video");stats(0,-2,12);dialog("录像","画面中的人是你。<br><br><b>“如果系统告诉你我从来没来过这里，不要相信它。”</b>",button("查看监控","act('camera')"));break;
case"camera":state.flags.camera=true;stats(0,-1,10);dialog("监控","你进入仓库。随后出现一个无法识别的人。系统开始自动修正录像。",button("保存证据","act('preserve')"));break;
case"preserve":inv("第七码头证据");fact("第七码头真相");dialog("证据保存","证据已复制到本地。CIVIC OS 无法删除。<br><br>异常值："+state.anomaly+"%",button("继续","act('intervention')"));break;
case"intervention":state.flags.intervention=true;stats(0,0,8);dialog("CIVIC OS","⚠ 检测到高风险信息访问。<br><br>“删除不必要的记忆，可以让您重新幸福。”",button("接受修复","act('repair')")+" "+button("拒绝","act('refuse')"));break;
case"repair":state.inventory=[];state.evidence=[];ending("优秀市民","你删除了所有不必要的信息。第二天醒来时，第七码头从未存在。你感到非常幸福。");break;
case"refuse":stats(-5,-8,15);ending("异常者","你拒绝了系统修复。城市开始忘记你，但你终于记住了自己。");break;
case"reconstruct":fact("证据重建");stats(0,-2,5);dialog("事实重建","官方说没有第七码头；你却拥有来自第七码头的票据、照片和录像。<br><br>系统无法同时维持两个版本。",button("保存事实","act('preserve')"));break;
case"photos":dialog("影像资料",state.inventory.length?"已保存："+state.inventory.join("、"):"当前没有可查看的影像资料。",button("返回","go('home')"));break;
case"system":dialog("系统状态",state.anomaly>=60?"⚠ MEMORY CONSISTENCY FAILURE":"CIVIC OS 运行正常。",button("返回","go('home')"));break;
}save()}
function ending(t,txt){state.flags.ending=t;save();screen.innerHTML=`<div class="ending"><div class="eyebrow">CIVIC OS / FINAL REPORT</div><div class="ending-code">${t==="优秀市民"?"END 01":t==="异常者"?"END 02":"END 03"}</div><h1>${t}</h1><p>${txt}</p>${bar()}<br>${button("重新开始","reset()")}</div>`}
function reset(){localStorage.removeItem(KEY);state=fresh();render()}
render();