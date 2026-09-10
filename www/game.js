const KEY="seventh-district-v01";
const defaultState={
 page:"home", time:"06:30", day:1, happiness:97, loyalty:83, anomaly:0,
 inventory:[], facts:[], flags:{intro:false, newsGlitch:false, paper:false, linSeen:false, archiveConflict:false, child:false, pierUnlocked:false, pierVisited:false, photo:false, video:false, report:false, declineReport:false, rebuilt:false, ending:null},
 emotionAttempts:0
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaultState);

const $=s=>document.querySelector(s);
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function addItem(x){if(!state.inventory.includes(x))state.inventory.push(x)}
function addFact(x){if(!state.facts.includes(x))state.facts.push(x)}
function esc(s){return String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
function setPage(p){state.page=p;save();render()}
function adjust(k,n){state[k]=Math.max(0,state[k]+n);save()}
function clock(t){state.time=t;$("#clock").textContent=t}

function render(){
 $("#clock").textContent=state.time;
 document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.page===state.page));
 const views={home:home,map:map,news:news,files:files,facts:facts};
 $("#screen").innerHTML=views[state.page]();
 bind();
}
function bind(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>setPage(b.dataset.go));
 document.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>action(b.dataset.act));
}
function stats(){
 return `<div class="card"><div class="row"><span>幸福度</span><b>${state.happiness}%</b></div><div class="meter"><i style="width:${state.happiness}%"></i></div>
<div class="row" style="margin-top:12px"><span>忠诚度</span><b>${state.loyalty}%</b></div><div class="meter"><i style="width:${state.loyalty}%"></i></div>
<div class="row" style="margin-top:12px"><span>异常值</span><b>${state.anomaly}</b></div></div>`
}
function home(){
 return `<div class="eyebrow">CIVIC OS / CITIZEN C-0817</div>
<h1>${state.flags.ending?"继续生活":"早安，市民。"}</h1>
<p>今日天气：晴<br>空气质量：优秀<br>社会稳定度：98.7%</p>
<div class="card"><div class="mini">今日推荐</div><h2 style="margin-top:7px">如何成为更好的邻居</h2><p>请微笑。请配合。请保持良好心情。</p></div>
${stats()}
<button class="btn" data-act="start">【 开始新的一天 】</button>
<button class="btn subtle" data-act="emotion">【 今日情绪：${state.flags.intro?"平静":"未选择"} 】</button>
<div class="footer-note">SYSTEM STATUS: NORMAL / VERSION 0.1</div>`
}
function map(){
 const pier=state.flags.pierUnlocked;
 return `<div class="eyebrow">CITY MAP / LIVE</div><h1>城市</h1>
<div class="notice">城市地图由中央规划局实时维护。<br>未经授权的地点不存在。</div>
<div class="grid" style="margin-top:12px">
<div class="place" data-act="homeArea"><div class="ico">⌂</div><b>幸福住宅区</b><span>居民区 / 正常</span></div>
<div class="place" data-act="service"><div class="ico">▣</div><b>公民服务中心</b><span>档案 / 事务</span></div>
<div class="place" data-act="square"><div class="ico">▥</div><b>市政广场</b><span>宣传 / 公共资讯</span></div>
<div class="place ${pier?'':'locked'}" data-act="${pier?'pier':'locked'}"><div class="ico">⚓</div><b>第七码头</b><span>${pier?'新增地点 / ？？？':'未开放 / 不存在'}</span></div>
</div>
${pier?`<div class="footer-note">MAP REVISION: 20:00 / SECTOR 07 ADDED</div>`:''}`
}
function news(){
 return `<div class="eyebrow">DAILY INFORMATION</div><h1>今日资讯</h1>
<div class="card"><div class="mini">06:12 / 城市日报</div><p>昨天，本市没有发生任何值得担忧的事件。</p>
<button class="btn" data-act="watchNews">查看新闻画面</button></div>
<div class="card"><div class="mini">08:30 / 市政公告</div><p>请各位市民积极参与社区幸福计划。举报负面信息，是每一位公民的责任。</p></div>
${state.flags.newsGlitch?`<div class="card glitch"><div class="mini">ARCHIVED FRAME / CORRUPTED</div><p>新闻画面中曾出现一名男子被工作人员带走。</p><div class="chips"><span class="chip">信息碎片：新闻画面</span></div></div>`:''}`
}
function files(){
 return `<div class="eyebrow">CITIZEN RECORD</div><h1>公民档案</h1>
<div class="card"><div class="row"><b>C-0817</b><span class="mini">ACTIVE</span></div>
<p>幸福度：${state.happiness}<br>忠诚度：${state.loyalty}<br>社交活跃度：正常<br>异常思想：${state.anomaly>0?"████ / 观察中":"无"}</p>
<p>家庭成员：1<br>固定住址：1</p>
<div class="notice">历史地址：████████████<br>████████████<br>【部分资料不存在】</div></div>
${state.flags.archiveConflict?`<div class="card glitch"><b>档案冲突</b><p>系统记录显示：某居民同时处于“已迁出”与“死亡”状态。</p></div>`:''}
<h2>已收集信息</h2>${state.inventory.length?`<div class="chips">${state.inventory.map(x=>`<span class="chip">${esc(x)}</span>`).join("")}</div>`:`<div class="empty">尚未收集异常信息。</div>`}`
}
function facts(){
 const has=(x)=>state.inventory.includes(x);
 const can1=has("旧报纸")&&has("失踪人口名单")&&has("社区记录");
 const can2=has("旧照片")&&has("第七码头车票")&&has("居民档案");
 return `<div class="eyebrow">EVIDENCE RECONSTRUCTION</div><h1>事实重构</h1>
<p>把彼此矛盾的信息放在一起。系统会尝试解释它们。</p>
<div class="card"><b>组合一 / 居民状态</b><p>旧报纸 + 失踪人口名单 + 社区记录</p>${can1?`<button class="btn" data-act="rebuild1">【 重构事实 】</button>`:`<div class="mini">需要更多证据。</div>`}</div>
<div class="card"><b>组合二 / 第七码头</b><p>旧照片 + 第七码头车票 + 居民档案</p>${can2?`<button class="btn" data-act="rebuild2">【 重构事实 】</button>`:`<div class="mini">需要更多证据。</div>`}</div>
${state.flags.rebuilt?`<div class="card glitch"><b>推论已形成</b><p>系统无法解释：C-0817 曾经到过一个“并不存在”的地点。</p></div>`:''}`
}

function action(a){
 switch(a){
 case"start": state.flags.intro=true; clock("06:42"); addFact("今日情绪记录"); save(); setPage("map"); break;
 case"emotion": emotion(); break;
 case"watchNews": state.flags.newsGlitch=true; addItem("新闻画面"); state.anomaly++;save();render();break;
 case"homeArea": homeArea();break;
 case"service": service();break;
 case"square": square();break;
 case"pier": pier();break;
 case"locked": popup("地图提示","该地点不存在。");break;
 case"paper": addItem("神秘纸条");state.flags.paper=true;state.anomaly++;save();render();break;
 case"showPaper": linDialog(true);break;
 case"hidePaper": linDialog(false);break;
 case"archive": state.flags.archiveConflict=true;addItem("失踪人口名单");addItem("社区记录");state.anomaly++;save();render();break;
 case"report": state.flags.report=true;state.loyalty+=5;state.happiness+=2;save();popup("公民责任","感谢您的配合。幸福度 +2 / 忠诚度 +5");break;
 case"decline": state.flags.declineReport=true;save();popup("系统","您确定吗？……好的。");break;
 case"child": state.flags.child=true;addItem("儿童地图");save();popup("诺亚","晚上八点以后，地图会多一个地方。");break;
 case"unlock": state.flags.pierUnlocked=true;clock("20:00");save();setPage("map");break;
 case"pierVisit": break;
 case"photo": addItem("旧照片");addItem("第七码头车票");state.flags.photo=true;save();render();break;
 case"video": addItem("居民档案");state.flags.video=true;save();render();break;
 case"rebuild1": state.flags.archiveConflict=true;state.flags.rebuilt=true;save();render();break;
 case"rebuild2": state.flags.rebuilt=true;save();render();break;
 case"endingGood": ending("优秀市民");break;
 case"endingBad": ending("异常者");break;
 case"endingSecret": ending("真正隐藏结局");break;
 }
}
function popup(title,text){$("#screen").innerHTML=`<div class="eyebrow">SYSTEM MESSAGE</div><h1>${title}</h1><div class="card"><p>${text}</p></div><button class="btn" data-go="${state.page}">返回</button>`;bind()}
function emotion(){
 state.emotionAttempts++;
 if(state.emotionAttempts>=7){popup("异常输入","“请描述您的真实感受：”<br><br>系统错误。");return}
 popup("今日情绪","请选择：<br><br>○ 幸福　○ 平静　○ 满意　○ 有待改善<br><br>“其他”暂不可用。");
}
function homeArea(){
 state.flags.linSeen=true; clock("07:10"); save();
 $("#screen").innerHTML=`<div class="eyebrow">SECTOR 01 / RESIDENTIAL</div><h1>幸福住宅区</h1>
<div class="card"><b>林阿姨</b><div class="dialog"><strong>林阿姨</strong>“今天也很幸福吧？”</div>
<p>她站在门口浇花，脸上的笑容标准得有些过分。</p>
<button class="btn" data-act="showPaper">【问：你知道第七码头吗？】</button>
</div>
<div class="card"><b>你的房间</b><p>冰箱上贴着《本周家庭幸福计划》。</p>
<div class="chips"><span class="chip">周一 与邻居微笑</span><span class="chip">周二 观看晚间新闻</span><span class="chip">周三 填写幸福问卷</span><span class="chip">周四 举报负面信息</span></div>
<button class="btn" data-act="paper">【调查门缝里的纸条】</button></div>`;bind()
}
function linDialog(show){
 $("#screen").innerHTML=`<div class="eyebrow">RESIDENT / LIN</div><h1>林阿姨</h1><div class="dialog"><strong>你</strong>“你知道第七码头吗？”</div><div class="dialog"><strong>林阿姨</strong>“没有这个地方。”</div>
${show||state.flags.paper?`<div class="dialog"><strong>你</strong>“那这张纸呢？”</div><div class="dialog"><strong>林阿姨</strong>“这不是我的。你没见过它。”</div><div class="notice">【异常值 +1】</div>`:""}
<button class="btn" data-go="map">返回城市</button>`
state.anomaly=Math.max(state.anomaly,1);save();bind()
}
function service(){
 clock("08:30");save();
 $("#screen").innerHTML=`<div class="eyebrow">CIVIC SERVICE CENTER</div><h1>公民服务中心</h1>
<div class="card"><div class="dialog"><strong>工作人员</strong>“姓名？”</div><div class="dialog"><strong>你</strong>“C-0817。”</div><div class="dialog"><strong>工作人员</strong>“很好。”</div>
<div class="dialog"><strong>工作人员</strong>“昨天晚上 23:14，你在哪里？”</div><div class="dialog"><strong>你</strong>“家里。”</div><div class="dialog"><strong>工作人员</strong>“很好。”</div></div>
<button class="btn" data-act="archive">【查看居民档案】</button><button class="btn subtle" data-go="map">离开</button>`;bind()
}
function square(){
 $("#screen").innerHTML=`<div class="eyebrow">MUNICIPAL SQUARE</div><h1>市政广场</h1>
<div class="card"><div class="bigstat">97.4%</div><div class="mini">CITY HAPPINESS INDEX</div><p>我们记录每一个人，因为每一个人都很重要。</p><p>今日消失人口：<b>0</b></p></div>
<div class="card"><b>诺亚</b><div class="dialog"><strong>诺亚</strong>“我画的是学校……还有码头。”</div><button class="btn" data-act="child">【问：第七码头？】</button></div>
<button class="btn subtle" data-go="map">离开广场</button>`;bind()
}
function pier(){
 clock("20:14");
 if(!state.flags.pierVisited){state.flags.pierVisited=true;save()}
 $("#screen").innerHTML=`<div class="eyebrow">SECTOR 07 / UNAUTHORIZED</div><h1>第七码头</h1>
<div class="notice">没有船。没有工作人员。只有一排储物柜。</div>
<div class="card"><b>储物柜 C-0817</b><p>里面有一张旧照片。</p><button class="btn" data-act="photo">【打开】</button></div>
${state.flags.photo?`<div class="card glitch"><p>照片里是你自己。</p><p class="mini">背面：“如果你看到这张照片，说明你已经忘记了。”</p><button class="btn" data-act="video">【恢复记忆录像】</button></div>`:''}
${state.flags.video?`<div class="card"><div class="dialog"><strong>录像 / C-0817</strong>“如果系统告诉你我从来没来过这里，不要相信它。”</div>
<div class="notice">系统：记忆恢复失败。<br>我们已经替您保存了一份更好的记忆。</div></div>`:''}
<h2>手机摄像头</h2><div class="card"><p>画面里，你身后站着一个人。</p><button class="btn danger" data-act="report">【举报异常人物】</button><button class="btn subtle" data-act="decline">【不举报】</button></div>
${state.flags.video?`<h2>第一章</h2><button class="btn" data-act="endingGood">【成为优秀市民】</button><button class="btn danger" data-act="endingBad">【成为异常者】</button>${state.emotionAttempts>=7?`<button class="btn" data-act="endingSecret">【拒绝被定义】</button>`:''}`:''}
<button class="btn subtle" data-go="map">离开第七码头</button>`;bind()
}
function ending(name){
 state.flags.ending=name;save();
 $("#screen").innerHTML=`<div class="eyebrow">CHAPTER ONE COMPLETE</div><h1>${name}</h1>
<div class="card"><p>${name==="优秀市民"?"幸福度：100%<br>忠诚度：100%<br><br>恭喜。您已经完全适应城市生活。":"异常值：10<br><br>您的行为已经无法解释。请留在家中。工作人员将在明早拜访您。"}</p></div>
<div class="card"><b>请保持幸福。</b><p>第一章结束。</p></div><button class="btn" data-go="home">回到主菜单</button>`;bind()
}
render();
