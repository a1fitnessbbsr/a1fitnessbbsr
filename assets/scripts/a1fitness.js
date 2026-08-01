// CURSOR
const cur=document.getElementById('cursor'),curR=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
const hspot=document.getElementById('hspot');
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';hspot?.style.setProperty('--mx',mx+'px');hspot?.style.setProperty('--my',my+'px');});
(function aR(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;curR.style.left=rx+'px';curR.style.top=ry+'px';requestAnimationFrame(aR)})();
document.querySelectorAll('a,button,input,select,textarea,[class*="card"],[class*="opt"],[class*="tab"],[class*="slot"],[class*="ts"]').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('ch'));el.addEventListener('mouseleave',()=>document.body.classList.remove('ch'));});

// LOADER
(function initLoader(){
  const loader=document.getElementById('loader'),skip=document.getElementById('ld-skip');
  const visited=sessionStorage.getItem('a1visited');
  function hideLoader(){
    loader.classList.add('out');
    document.body.classList.add('no-load-anim');
    sessionStorage.setItem('a1visited','1');
  }
  if(visited){hideLoader();return}
  setTimeout(hideLoader,3400);
  skip?.addEventListener('click',hideLoader);
})();

// NAV
window.addEventListener('scroll',()=>document.getElementById('navbar').classList.toggle('sc',scrollY>40));
const hbg=document.getElementById('hbg'),mob=document.getElementById('mob');
const themeToggle=document.getElementById('theme-toggle');
const themeMeta=document.querySelector('meta[name="theme-color"]');
const themeDefault='light';
function applyTheme(theme){
  const next=theme==='dark'?'dark':'light';
  document.documentElement.dataset.theme=next;
  document.documentElement.style.colorScheme=next;
  document.documentElement.style.backgroundColor=next==='dark'?'#050505':'#ffffff';
  document.body.style.backgroundColor=next==='dark'?'#050505':'#ffffff';
  document.body.style.color=next==='dark'?'#f2f2f6':'#0f172a';
  document.documentElement.setAttribute('data-theme-state',next);
  themeToggle?.setAttribute('aria-checked',String(next==='dark'));
  themeToggle?.setAttribute('aria-label',next==='dark'?'Switch to light mode':'Switch to dark mode');
  themeToggle?.setAttribute('title',next==='dark'?'Switch to light mode':'Switch to dark mode');
  if(themeMeta) themeMeta.setAttribute('content',next==='dark'?'#0b0f14':'#eaf1fb');
  try{localStorage.setItem('a1-theme',next);}catch(e){}
}
applyTheme(document.documentElement.dataset.theme||themeDefault);
themeToggle?.addEventListener('click',()=>{
  const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
  applyTheme(next);
});
function setMob(open){
  mob.classList.toggle('open',open);
  hbg.setAttribute('aria-expanded',open);
  hbg.setAttribute('aria-label',open?'Close menu':'Open menu');
  document.body.style.overflow=open?'hidden':'';
}
hbg.addEventListener('click',()=>setMob(!mob.classList.contains('open')));
document.getElementById('mob-close')?.addEventListener('click',()=>setMob(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mob.classList.contains('open'))setMob(false)});
function cm(){setMob(false)}

// PARTICLES
const pc=document.getElementById('particles');
for(let i=0;i<28;i++){const p=document.createElement('div');p.className='particle';p.style.cssText=`left:${Math.random()*100}%;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*8}s;--drift:${(Math.random()-.5)*100}px`;pc.appendChild(p);}

// HERO PARALLAX
(function(){
  const hero=document.getElementById('hero'),media=document.getElementById('h-bg-media');
  if(!hero||!media||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let ticking=false;
  function uHeroParallax(){
    const y=hero.getBoundingClientRect().top;
    if(y<=0&&y>-hero.offsetHeight)media.style.transform=`translate3d(0,${y*.28}px,0)`;
    else if(y>0)media.style.transform='translate3d(0,0,0)';
    ticking=false;
  }
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(uHeroParallax);ticking=true}},{passive:true});
  uHeroParallax();
})();

// REVEAL
const ro=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('v')}),{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal,.rl,.rr').forEach(el=>ro.observe(el));

// COUNTERS
function countUp(el,t){const d=2200,s=performance.now();(function u(n){const p=Math.min((n-s)/d,1),e=1-Math.pow(1-p,3);el.textContent=Math.round(e*t).toLocaleString();p<1&&requestAnimationFrame(u)})(s)}
const statsSection=document.getElementById('stats');
if(statsSection){
  new IntersectionObserver(e=>{if(e[0].isIntersecting)document.querySelectorAll('[data-t]').forEach(el=>countUp(el,+el.dataset.t))},{threshold:.3}).observe(statsSection);
}

// PLAN TABS
function swPlan(id,btn){['m','q','a','c'].forEach(k=>{const el=document.getElementById('p'+k);if(el)el.classList.remove('active')});document.getElementById('p'+id).classList.add('active');document.querySelectorAll('.plan-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}

// TOOL NAV & TABS
function swTool(id,btn){
  document.querySelectorAll('.tool-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tpick').forEach(b=>b.classList.remove('active'));
  const panel=document.getElementById('tp-'+id);
  if(panel)panel.classList.add('active');
  const pick=btn||document.querySelector(`.tpick[data-tool="${id}"]`);
  if(pick){
    pick.classList.add('active');
    if(pick.classList.contains('hidden')){
      document.querySelectorAll('.tpick:not(.hidden)')[0]?.click();
      return;
    }
  }
  const ws=document.querySelector('.tool-workspace');
  if(ws&&window.innerWidth<960)ws.scrollIntoView({behavior:'smooth',block:'nearest'});
}
document.querySelectorAll('.tpick').forEach(btn=>btn.addEventListener('click',()=>swTool(btn.dataset.tool,btn)));
(function initToolNav(){
  const search=document.getElementById('tool-search');
  const cats=document.querySelectorAll('.tcat');
  let activeCat='all';
  function filterTools(){
    const q=(search?.value||'').toLowerCase().trim();
    document.querySelectorAll('.tpick').forEach(btn=>{
      const matchCat=activeCat==='all'||btn.dataset.cat===activeCat;
      const keys=(btn.dataset.keywords||'')+' '+btn.textContent.toLowerCase();
      const matchSearch=!q||keys.includes(q);
      btn.classList.toggle('hidden',!(matchCat&&matchSearch));
    });
  }
  search?.addEventListener('input',filterTools);
  cats.forEach(c=>c.addEventListener('click',()=>{
    cats.forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    activeCat=c.dataset.cat;
    filterTools();
  }));
})();

// UNIT TOGGLE
function togU(calc,u,btn){document.querySelectorAll(`[onclick*="togU('${calc}'"]`).forEach(b=>b.classList.remove('active'));btn.classList.add('active');if(calc==='bmi'){document.getElementById('bmi-wl').textContent=u==='m'?'Weight (kg)':'Weight (lbs)';document.getElementById('bmi-hl').textContent=u==='m'?'Height (cm)':'Height (inches)';document.getElementById('bmi-w').placeholder=u==='m'?'75':'165';document.getElementById('bmi-h').placeholder=u==='m'?'175':'69';document.getElementById('bmi-w').dataset.unit=u;}}

// ===== CALCULATOR HELPERS =====
function hbBMR(age,g,w,h){return g==='m'?88.362+(13.397*w)+(4.799*h)-(5.677*age):447.593+(9.247*w)+(3.098*h)-(4.330*age)}
function msjBMR(age,g,w,h){return g==='m'?10*w+6.25*h-5*age+5:10*w+6.25*h-5*age-161}
function rbRows(rows){return rows.map(([l,v,c])=>`<div class="rb-row"><div class="rb-lbl">${l}</div><div class="rb-val"${c?` style="color:${c}"`:''}>${v}</div></div>`).join('')}

// ===== CALCULATORS =====

// BMI
function doBMI(){
  const w=+document.getElementById('bmi-w').value,h=+document.getElementById('bmi-h').value,u=document.getElementById('bmi-w').dataset.unit||'m';
  if(!w||!h)return;
  const bmi=u==='i'?+(703*w/(h*h)).toFixed(1):+(w/((h/100)**2)).toFixed(1);
  let cat,col,advice,pct;
  if(bmi<18.5){cat='Underweight';col='#0077ff';advice='Focus on a caloric surplus with strength training to build muscle and reach a healthy weight. Our Strength Training program is a perfect starting point.';pct=10}
  else if(bmi<25){cat='Normal Weight';col='#00cc88';advice='You\'re in the healthy range. Optimise further with Muscle Building and structured nutrition to refine your physique and elevate performance.';pct=32}
  else if(bmi<30){cat='Overweight';col='#ffaa00';advice='Our Weight Loss and Cardio Conditioning programs are designed to efficiently bring you back to your optimal range while preserving muscle mass.';pct=55}
  else if(bmi<35){cat='Obese Class I';col='#ff4400';advice='Our 1-on-1 Elite coaching is the fastest, most supported path forward. We\'ve transformed hundreds of members starting exactly here.';pct=74}
  else{cat='Obese Class II+';col='#cc0000';advice='Your journey begins with one decision. Book a free consultation — our coaches create medically-informed programs tailored to your exact starting point.';pct=90}
  document.getElementById('bmi-res').innerHTML=`
    <div class="res-main"><div class="res-big">${bmi}</div><div class="res-unit">Body Mass Index</div><div class="res-cat" style="background:${col}22;color:${col};border:1px solid ${col}44">${cat}</div></div>
    <div class="res-scale"><div class="scale-bar"><div class="scale-seg" style="background:#0077ff"></div><div class="scale-seg" style="background:#00cc88"></div><div class="scale-seg" style="background:#ffaa00"></div><div class="scale-seg" style="background:#ff4400"></div><div class="scale-seg" style="background:#cc0000"></div></div><div class="scale-ptr"><div class="scale-arrow" style="left:${pct}%"></div></div><div class="scale-lbls"><span>Under</span><span>Normal</span><span>Over</span><span>Obese</span><span>Morbid</span></div></div>
    <div class="res-advice">${advice}</div>`;
}

// BMR
function doBMR(){
  const age=+document.getElementById('bmr-age').value,g=document.getElementById('bmr-g').value;
  const w=+document.getElementById('bmr-w').value,h=+document.getElementById('bmr-h').value;
  if(!age||!w||!h)return;
  const hb=Math.round(hbBMR(age,g,w,h)),msj=Math.round(msjBMR(age,g,w,h)),avg=Math.round((hb+msj)/2);
  document.getElementById('bmr-res').innerHTML=`
    <div class="res-main"><div class="res-big">${avg}</div><div class="res-unit">kcal / day — BMR (avg)</div></div>
    <div class="res-bdown">${rbRows([['Harris-Benedict',hb.toLocaleString()+' kcal'],['Mifflin-St Jeor',msj.toLocaleString()+' kcal'],['Daily Minimum',avg.toLocaleString()+' kcal','var(--blue)']])}</div>
    <div class="res-advice">Your BMR is the calories burned at complete rest. Multiply by activity level (TDEE calculator) to find maintenance intake. Never eat below BMR long-term without medical supervision.</div>`;
}

// TDEE
function doTDEE(){
  const age=+document.getElementById('tdee-age').value,g=document.getElementById('tdee-g').value;
  const w=+document.getElementById('tdee-w').value,h=+document.getElementById('tdee-h').value;
  const act=+document.getElementById('tdee-act').value;
  if(!age||!w||!h)return;
  const bmr=Math.round(msjBMR(age,g,w,h)),tdee=Math.round(bmr*act);
  const acts=[['Sedentary',Math.round(bmr*1.2)],['Light Activity',Math.round(bmr*1.375)],['Moderate',Math.round(bmr*1.55)],['Very Active',Math.round(bmr*1.725)],['Extreme',Math.round(bmr*1.9)]];
  document.getElementById('tdee-res').innerHTML=`
    <div class="res-main"><div class="res-big">${tdee.toLocaleString()}</div><div class="res-unit">kcal / day — Maintenance (TDEE)</div></div>
    <div class="res-bdown">${rbRows([['BMR (Resting)',bmr.toLocaleString()+' kcal'],...acts.map(([l,v])=>[l,v.toLocaleString()+' kcal',v===tdee?'var(--blue)':null])])}</div>
    <div class="res-advice">TDEE is your maintenance calories. Eat below to lose fat, above to build muscle. Use the Calorie Intake calculator for goal-specific targets.</div>`;
}

// CALORIE INTAKE
function doCI(){
  const age=+document.getElementById('ci-age').value,g=document.getElementById('ci-g').value;
  const w=+document.getElementById('ci-w').value,h=+document.getElementById('ci-h').value;
  const act=+document.getElementById('ci-act').value,goal=document.getElementById('ci-goal').value;
  const adj=+document.getElementById('ci-adj').value;
  if(!age||!w||!h)return;
  const bmr=Math.round(msjBMR(age,g,w,h)),tdee=Math.round(bmr*act);
  const target=goal==='lose'?tdee-adj:goal==='gain'?tdee+adj:tdee;
  const lbl=goal==='lose'?'Fat Loss Target':goal==='gain'?'Muscle Gain Target':'Maintenance';
  document.getElementById('ci-res').innerHTML=`
    <div class="res-main"><div class="res-big">${target.toLocaleString()}</div><div class="res-unit">Calories / Day</div><div class="res-cat" style="background:rgba(0,119,255,.15);color:var(--blue);border:1px solid rgba(0,119,255,.3)">${lbl}</div></div>
    <div class="res-bdown">${rbRows([['BMR (Resting)',bmr.toLocaleString()+' kcal'],['TDEE (Maintenance)',tdee.toLocaleString()+' kcal'],['Adjustment',(goal==='lose'?'−':'+')+adj+' kcal'],['Your Target',target.toLocaleString()+' kcal','var(--blue)']])}</div>
    <div class="res-advice">These calories support ${goal==='lose'?'losing ~'+(adj/500).toFixed(1)+' lb/week':goal==='gain'?'lean muscle gain with a '+adj+' kcal surplus':'maintaining your current weight'}. Pair with A1 Fitness coaching for maximum results.</div>`;
}

// LEAN BODY MASS
function doLBM(){
  const w=+document.getElementById('lbm-w').value,bf=+document.getElementById('lbm-bf').value;
  if(!w||isNaN(bf))return;
  const lbm=+(w*(1-bf/100)).toFixed(1),fm=+(w-lbm).toFixed(1);
  document.getElementById('lbm-res').innerHTML=`
    <div class="res-main"><div class="res-big">${lbm}</div><div class="res-unit">kg — Lean Body Mass</div></div>
    <div class="res-bdown">${rbRows([['Total Weight',w+' kg'],['Body Fat %',bf+'%'],['Fat Mass',fm+' kg','var(--red)'],['Lean Mass',lbm+' kg','var(--green)'],['Lean Mass Ratio',(100-bf).toFixed(1)+'%','var(--blue)']])}</div>
    <div class="res-advice">Track lean mass over time during cuts and bulks — it's the best indicator of real progress. Combine Weight Loss with Muscle Building for a balanced recomposition approach.</div>`;
}

// WAIST TO HIP
function doWHR(){
  const g=document.getElementById('whr-g').value,wa=+document.getElementById('whr-w').value,hi=+document.getElementById('whr-h').value;
  if(!wa||!hi)return;
  const ratio=+(wa/hi).toFixed(2);
  let cat,col,shape;
  if(g==='m'){if(ratio<.9){cat='Low Risk';col='#00cc88';shape='Pear / lower-body storage'}else if(ratio<1){cat='Moderate Risk';col='#ffaa00';shape='Mixed distribution'}else{cat='High Risk';col='#ff4400';shape='Apple / central adiposity'}}
  else{if(ratio<.8){cat='Low Risk';col='#00cc88';shape='Pear / lower-body storage'}else if(ratio<.85){cat='Moderate Risk';col='#ffaa00';shape='Mixed distribution'}else{cat='High Risk';col='#ff4400';shape='Apple / central adiposity'}}
  document.getElementById('whr-res').innerHTML=`
    <div class="res-main"><div class="res-big">${ratio}</div><div class="res-unit">Waist-to-Hip Ratio</div><div class="res-cat" style="background:${col}22;color:${col};border:1px solid ${col}44">${cat}</div></div>
    <div class="res-bdown">${rbRows([['Waist',wa+' cm'],['Hip',hi+' cm'],['Body Shape',shape],['Male Threshold','< 0.90 low risk'],['Female Threshold','< 0.80 low risk']])}</div>
    <div class="res-advice">${cat==='Low Risk'?'Excellent fat distribution profile. Maintain with consistent training and balanced nutrition.':'Central fat storage increases cardiovascular risk. Our Weight Loss and Cardio Conditioning programs target visceral fat efficiently — book a free consultation to get started.'}</div>`;
}

// FFMI
function doFFMI(){
  const h=+document.getElementById('ffmi-h').value,w=+document.getElementById('ffmi-w').value,bf=+document.getElementById('ffmi-bf').value;
  if(!h||!w||isNaN(bf))return;
  const lean=w*(1-bf/100),hm=h/100;
  const ffmi=+(lean/(hm*hm)).toFixed(1);
  const norm=+(ffmi+6.1*(1.8-hm)).toFixed(1);
  let cat,col;
  if(norm<18){cat='Below Average';col='#0077ff'}else if(norm<20){cat='Average';col='#00cc88'}else if(norm<22){cat='Above Average';col='#00cc88'}else if(norm<24){cat='Excellent';col='#1a7aff'}else if(norm<26){cat='Elite / Superior';col='#c8a020'}else{cat='Exceptional';col='#ff2035'}
  document.getElementById('ffmi-res').innerHTML=`
    <div class="res-main"><div class="res-big">${norm}</div><div class="res-unit">Normalized FFMI</div><div class="res-cat" style="background:${col}22;color:${col};border:1px solid ${col}44">${cat}</div></div>
    <div class="res-bdown">${rbRows([['Raw FFMI',ffmi],['Normalized FFMI',norm,'var(--blue)'],['Lean Mass',lean.toFixed(1)+' kg'],['Body Fat',bf+'%'],['Reference: 25+', 'Likely enhanced','var(--soft)']])}</div>
    <div class="res-advice">FFMI above 22 is exceptional natural muscularity. Normalized FFMI adjusts for height. Use alongside body fat % for a complete picture of your physique development.</div>`;
}

// PROTEIN
function doPRO(){
  const w=+document.getElementById('pro-w').value,goal=document.getElementById('pro-g').value,act=document.getElementById('pro-act').value;
  if(!w)return;
  const base={maintain:1.6,fat:2.2,muscle:2.0,endurance:1.8}[goal];
  const bonus={low:0,mod:0.1,high:0.2,elite:0.3}[act];
  const gKg=+(base+bonus).toFixed(2),grams=Math.round(w*gKg);
  const meals=Math.round(grams/4);
  document.getElementById('pro-res').innerHTML=`
    <div class="res-main"><div class="res-big">${grams}g</div><div class="res-unit">Protein / Day</div></div>
    <div class="res-bdown">${rbRows([['Per kg Body Weight',gKg+' g/kg'],['Per Meal (~4 meals)',meals+' g'],['Calories from Protein',(grams*4).toLocaleString()+' kcal','var(--blue)'],['Minimum (ISSN)',Math.round(w*1.4)+' g'],['Upper Range (cutting)',Math.round(w*2.4)+' g']])}</div>
    <div class="res-advice">Spread ${grams}g across 4–5 meals (~${meals}g each) for optimal muscle protein synthesis. ${goal==='fat'?'Higher protein during a deficit preserves lean mass.':goal==='muscle'?'Pair with a caloric surplus and progressive overload for maximum gains.':'Consistent intake supports recovery and body composition.'}</div>`;
}

// BSA
function doBSA(){
  const w=+document.getElementById('bsa-w').value,h=+document.getElementById('bsa-h').value;
  if(!w||!h)return;
  const bsa=+(0.007184*Math.pow(w,0.425)*Math.pow(h,0.725)).toFixed(2);
  const mosteller=+(Math.sqrt(w*h/3600)).toFixed(2);
  document.getElementById('bsa-res').innerHTML=`
    <div class="res-main"><div class="res-big">${bsa}</div><div class="res-unit">m² — Body Surface Area</div></div>
    <div class="res-bdown">${rbRows([['Du Bois Formula',bsa+' m²'],['Mosteller Formula',mosteller+' m²'],['Average',((bsa+mosteller)/2).toFixed(2)+' m²','var(--blue)'],['Reference Range','1.6 – 2.0 m²','var(--soft)']])}</div>
    <div class="res-advice">BSA is used to scale metabolic calculations and clinical dosing. For fitness planning, TDEE and macro calculators are more practical day-to-day tools.</div>`;
}

// WORKOUT VOLUME
function doVOL(){
  const exs=[[document.getElementById('vol-n1').value||'Exercise 1','vol-s1','vol-r1','vol-w1'],
    [document.getElementById('vol-n2').value||'Exercise 2','vol-s2','vol-r2','vol-w2'],
    [document.getElementById('vol-n3').value||'Exercise 3','vol-s3','vol-r3','vol-w3']];
  let total=0,rows=[];
  exs.forEach(([name,si,ri,wi])=>{
    const s=+document.getElementById(si).value,r=+document.getElementById(ri).value,w=+document.getElementById(wi).value;
    if(s&&r&&w){const vol=s*r*w;total+=vol;rows.push([name,vol.toLocaleString()+' kg','var(--soft)']);}
  });
  if(!total)return;
  document.getElementById('vol-res').innerHTML=`
    <div class="res-main"><div class="res-big">${total.toLocaleString()}</div><div class="res-unit">kg — Total Session Volume</div></div>
    <div class="res-bdown">${rbRows(rows.concat([['Session Tonnage',total.toLocaleString()+' kg','var(--blue)']]))}</div>
    <div class="res-advice">Volume = sets × reps × weight. Track weekly tonnage per muscle group and increase 5–10% progressively. Hypertrophy sweet spot: 10–20 hard sets per muscle group per week.</div>`;
}

// MUSCLE GAIN
function doMG(){
  const cw=+document.getElementById('mg-cw').value,gw=+document.getElementById('mg-gw').value;
  const exp=document.getElementById('mg-exp').value,sess=+document.getElementById('mg-s').value;
  if(!cw||!gw||gw<=cw)return;
  const diff=+(gw-cw).toFixed(1);
  const rate={beginner:.45,intermediate:.25,advanced:.12}[exp];
  const wks=Math.ceil(diff/rate),months=+(wks/4.33).toFixed(1);
  document.getElementById('mg-res').innerHTML=`
    <div class="res-main"><div class="res-big">${wks}</div><div class="res-unit">Weeks to Target Weight</div></div>
    <div class="res-bdown">${rbRows([['Muscle to Gain',diff+' kg'],['Weekly Rate',rate+' kg/wk'],['Total Sessions',wks*sess],['Timeline',months+' months','var(--blue)'],['Caloric Surplus','+'+Math.round(rate*1100)+' kcal/wk est.','var(--gold)']])}</div>
    <div class="res-advice">Natural muscle gain: beginners ~0.45 kg/wk, intermediates ~0.25 kg/wk, advanced ~0.12 kg/wk. Eat ${Math.round(cw*2)}g+ protein daily and follow our Muscle Building program for structured hypertrophy.</div>`;
}

// WEIGHT LOSS TIMELINE
function doWLT(){
  const cw=+document.getElementById('wlt-cw').value,gw=+document.getElementById('wlt-gw').value;
  const sess=+document.getElementById('wlt-s').value,rate=+document.getElementById('wlt-rate').value;
  const dateStr=document.getElementById('wlt-d').value;
  const res=document.getElementById('wlt-res');
  if(!cw||!gw||cw<=gw||!rate||rate<=0){
    res.innerHTML=`<div class="res-empty"><div class="res-empty-icon">!</div><div class="res-empty-txt">Enter a current weight higher than your goal weight</div></div>`;
    return;
  }
  const diff=+(cw-gw).toFixed(1),wks=Math.ceil(diff/rate),total=wks*sess;
  let dateNote='';
  if(dateStr){
    const target=new Date(dateStr+'T00:00:00');
    const today=new Date();today.setHours(0,0,0,0);
    const wksLeft=Math.floor((target-today)/604800000);
    dateNote=wksLeft>=0?` Your target date is <strong>${wksLeft} weeks away</strong> — ${wksLeft>=wks?'✅ achievable':'⚠️ ambitious — increase sessions or adjust target'}.`:` Your selected date is in the past — please choose a future target date.`;
  }
  res.innerHTML=`
    <div class="res-main"><div class="res-big">${wks}</div><div class="res-unit">Weeks to Goal Weight</div></div>
    <div class="res-bdown">${rbRows([['Weight to Lose',diff+' kg','var(--blue)'],['Weekly Rate',rate+' kg/wk'],['Total Sessions',total],['Timeline',(wks/4.33).toFixed(1)+' months'],['Daily Deficit','~'+Math.round(rate*1100/7)+' kcal est.','var(--gold)']])}</div>
    <div class="res-advice">At ${sess} sessions/week and ${rate} kg/week, you'll reach ${gw} kg in ~${wks} weeks.${dateNote} Our Weight Loss program is designed for exactly this trajectory.</div>`;
}
// HEART RATE ZONES
function doTHR(){
  const age=+document.getElementById('thr-age').value,rhr=+document.getElementById('thr-rhr').value||0;
  const form=document.getElementById('thr-form').value;
  if(!age)return;
  let maxHR=form==='fox'?220-age:form==='gulati'?206-0.88*age:208-0.7*age;
  maxHR=Math.round(maxHR);
  const zones=[['Zone 1 — Recovery','50–60%','Fat burn & active recovery',.5,.6,'#0077ff'],
    ['Zone 2 — Endurance','60–70%','Aerobic base building',.6,.7,'#00cc88'],
    ['Zone 3 — Tempo','70–80%','Cardiovascular fitness',.7,.8,'var(--gold)'],
    ['Zone 4 — Threshold','80–90%','Lactate threshold / HIIT',.8,.9,'#ff6600'],
    ['Zone 5 — Max Effort','90–100%','Peak performance / sprints',.9,1,'var(--red)']];
  const useK=rhr>40;
  const rows=zones.map(([name,pct,desc,lo,hi,col])=>{
    const bpmLo=useK?Math.round(rhr+(maxHR-rhr)*lo):Math.round(maxHR*lo);
    const bpmHi=useK?Math.round(rhr+(maxHR-rhr)*hi):Math.round(maxHR*hi);
    return `<div class="rb-row"><div class="rb-lbl">${name}<br><span style="font-size:.55rem;color:var(--muted);letter-spacing:.1em">${pct} · ${desc}</span></div><div class="rb-val" style="color:${col}">${bpmLo}–${bpmHi}</div></div>`;
  }).join('');
  document.getElementById('thr-res').innerHTML=`
    <div class="res-main"><div class="res-big">${maxHR}</div><div class="res-unit">bpm — Max Heart Rate</div></div>
    <div class="res-bdown">${rows}</div>
    <div class="res-advice">${useK?'Using Karvonen formula (HR reserve) for personalised zones.':'Add resting HR for Karvonen-adjusted zones. '}Zone 2 builds your aerobic engine. Zone 4–5 for HIIT sessions in our Cardio Conditioning classes.</div>`;
}

// CALORIE BURN
function doBURN(){
  const w=+document.getElementById('burn-w').value,d=+document.getElementById('burn-d').value;
  const met=+document.getElementById('burn-act').value;
  if(!w||!d)return;
  const kcal=Math.round(met*w*(d/60));
  const perHr=Math.round(met*w);
  const label=document.getElementById('burn-act').selectedOptions[0].text;
  document.getElementById('burn-res').innerHTML=`
    <div class="res-main"><div class="res-big">${kcal}</div><div class="res-unit">kcal Burned — ${d} min</div></div>
    <div class="res-bdown">${rbRows([['Activity',label],['MET Value',met],['Burn Rate',perHr+' kcal/hr'],['Session Total',kcal+' kcal','var(--blue)'],['Equivalent',Math.round(kcal/7.7)+' g fat energy','var(--gold)']])}</div>
    <div class="res-advice">${kcal} kcal burned in ${d} minutes. Combine cardio with strength training for optimal body composition — exactly what our programs deliver.</div>`;
}

// PACE & CARDIO
function doPACE(){
  const dist=+document.getElementById('pace-dist').value,time=+document.getElementById('pace-time').value;
  const w=+document.getElementById('pace-w').value||75,type=document.getElementById('pace-type').value;
  if(!dist||!time)return;
  const paceMin=time/dist;
  const pMin=Math.floor(paceMin),pSec=Math.round((paceMin-pMin)*60);
  const speed=+(dist/(time/60)).toFixed(2);
  const met=type==='run'?speed<8?8.3:speed<10?9.8:11.5:type==='walk'?3.5:6.8;
  const kcal=Math.round(met*w*(time/60));
  const splits=[1,2,5].filter(s=>s<=dist).map(s=>{
    const t=s*paceMin,m=Math.floor(t),sec=Math.round((t-m)*60);
    return [s+' km split',m+':'+(sec<10?'0':'')+sec];
  });
  document.getElementById('pace-res').innerHTML=`
    <div class="res-main"><div class="res-big">${pMin}:${pSec<10?'0':''}${pSec}</div><div class="res-unit">min/km — Average Pace</div></div>
    <div class="res-bdown">${rbRows([['Distance',dist+' km'],['Total Time',Math.floor(time)+' min '+Math.round((time%1)*60)+' sec'],['Speed',speed+' km/h','var(--blue)'],['Est. Calories',kcal+' kcal','var(--gold)'],...splits])}</div>
    <div class="res-advice">Pace ${pMin}:${pSec<10?'0':''}${pSec}/km at ${speed} km/h. ${speed>=10?'Elite running pace — our Functional Fitness program can push you further.':speed>=7?'Solid cardio fitness — add interval training to improve.':'Build aerobic base in Zone 2, then progress to tempo runs.'}</div>`;
}

// LEGACY ALIASES
function doCal(){doCI()}
function doGP(){doWLT()}

// BODY FAT
function doBF(){
  const g=document.getElementById('bf-g').value,h=+document.getElementById('bf-h').value;
  const wa=+document.getElementById('bf-w').value,ne=+document.getElementById('bf-n').value;
  const hip=+document.getElementById('bf-hip').value;
  const res=document.getElementById('bf-res');
  if(!h||!wa||!ne||(g==='f'&&!hip)){
    res.innerHTML=`<div class="res-empty"><div class="res-empty-icon">!</div><div class="res-empty-txt">Please enter height, waist, neck${g==='f'?', and hip':''} measurements</div></div>`;
    return;
  }
  const toIn=v=>v/2.54;
  const hi=toIn(h),wai=toIn(wa),nei=toIn(ne),hipi=toIn(hip);
  const maleBase=wai-nei,femaleBase=wai+hipi-nei;
  if(hi<=0||wai<=0||nei<=0||(g==='m'&&maleBase<=0)||(g==='f'&&femaleBase<=0)){
    res.innerHTML=`<div class="res-empty"><div class="res-empty-icon">!</div><div class="res-empty-txt">Check the measurements and make sure waist is larger than neck${g==='f'?' and hip values are entered correctly':''}</div></div>`;
    return;
  }
  let bf;
  if(g==='m')bf=495/(1.0324-0.19077*Math.log10(maleBase)+0.15456*Math.log10(hi))-450;
  else bf=495/(1.29579-0.35004*Math.log10(femaleBase)+0.22100*Math.log10(hi))-450;
  bf=+Math.max(2,Math.min(60,bf)).toFixed(1);
  let cat,col;
  if(g==='m'){if(bf<6){cat='Essential Fat';col='#0077ff'}else if(bf<14){cat='Athletic';col='#00cc88'}else if(bf<18){cat='Fitness';col='#00cc88'}else if(bf<25){cat='Acceptable';col='#ffaa00'}else{cat='Obese';col='#ff4400'}}
  else{if(bf<14){cat='Essential Fat';col='#0077ff'}else if(bf<21){cat='Athletic';col='#00cc88'}else if(bf<25){cat='Fitness';col='#00cc88'}else if(bf<32){cat='Acceptable';col='#ffaa00'}else{cat='Obese';col='#ff4400'}}
  res.innerHTML=`
    <div class="res-main"><div class="res-big">${bf}%</div><div class="res-unit">Body Fat Percentage</div><div class="res-cat" style="background:${col}22;color:${col};border:1px solid ${col}44">${cat}</div></div>
    <div class="res-bdown"><div class="rb-row"><div class="rb-lbl">Method</div><div class="rb-val" style="color:var(--blue)">US Navy circumference formula</div></div><div class="rb-row"><div class="rb-lbl">Inputs Used</div><div class="rb-val">${g==='m'?'Height, waist, neck':'Height, waist, neck, hip'}</div></div></div>
    <div class="res-advice">${(g==='m'&&bf>20)||(g==='f'&&bf>28)?'Our Weight Loss and Muscle Building programs can help reduce body fat while preserving lean muscle. Book a free consultation to get started.':'Great foundation. Focus on building lean muscle and tracking trends over time for the most useful picture.'}</div>`;
}
// MACROS
function doMac(){
  const cal=+document.getElementById('mac-c').value,goal=document.getElementById('mac-g').value;
  const body=document.getElementById('mac-bt').value;
  const act=document.getElementById('mac-act').value;
  if(!cal)return;
  let pP=.3,cP=.4,fP=.3;
  if(goal==='fat'){pP=.35;cP=.35;fP=.3}else if(goal==='muscle'){pP=.3;cP=.45;fP=.25}
  if(body==='ecto'){cP+=.05;fP-=.05}if(body==='endo'){pP+=.05;cP-=.05}
  if(act==='low'){pP+=.03;fP+=.02;cP-=.05}
  else if(act==='high'){cP+=.05;pP-=.02;fP-=.03}
  const total=pP+cP+fP;
  pP/=total;cP/=total;fP/=total;
  const p=Math.round(cal*pP/4),c=Math.round(cal*cP/4),f=Math.round(cal*fP/9);
  document.getElementById('mac-res').innerHTML=`
    <div class="res-main"><div class="res-big">${cal.toLocaleString()}</div><div class="res-unit">Total Calories / Day</div></div>
    <div class="res-bars">
      <div class="rbar"><div class="rbar-lbl">🥩 Protein</div><div class="rbar-track"><div class="rbar-fill" style="width:${Math.round(pP*100)}%;background:var(--blue)"></div></div><div class="rbar-val" style="color:var(--blue)">${p}g</div></div>
      <div class="rbar"><div class="rbar-lbl">🍚 Carbs</div><div class="rbar-track"><div class="rbar-fill" style="width:${Math.round(cP*100)}%;background:var(--gold)"></div></div><div class="rbar-val" style="color:var(--gold)">${c}g</div></div>
      <div class="rbar"><div class="rbar-lbl">🥑 Fat</div><div class="rbar-track"><div class="rbar-fill" style="width:${Math.round(fP*100)}%;background:var(--red)"></div></div><div class="rbar-val" style="color:var(--red)">${f}g</div></div>
    </div>
    <div class="res-bdown"><div class="rb-row"><div class="rb-lbl">Protein Calories</div><div class="rb-val">${Math.round(cal*pP)} kcal</div></div><div class="rb-row"><div class="rb-lbl">Carb Calories</div><div class="rb-val">${Math.round(cal*cP)} kcal</div></div><div class="rb-row"><div class="rb-lbl">Fat Calories</div><div class="rb-val">${Math.round(cal*fP)} kcal</div></div></div>
    <div class="res-advice">Optimised for ${goal==='fat'?'fat loss — higher protein preserves muscle while in deficit':goal==='muscle'?'muscle gain — elevated carbs fuel intense training and recovery':'maintenance — balanced macros support body composition and performance'}.</div>`;
}

// WATER
function doWat(){
  const w=+document.getElementById('wat-w').value,act=+document.getElementById('wat-a').value,cl=+document.getElementById('wat-c').value;
  if(!w)return;
  const total=+(w*35/1000*act*cl).toFixed(1);const glasses=Math.round(total*1000/250);
  const duringHr=Math.round(400+(act-1)*250+(cl-1)*150);
  document.getElementById('wat-res').innerHTML=`
    <div class="res-main"><div class="res-big">${total}L</div><div class="res-unit">Daily Water Intake</div></div>
    <div class="res-bdown"><div class="rb-row"><div class="rb-lbl">In Glasses (250ml)</div><div class="rb-val" style="color:var(--blue)">${glasses} glasses</div></div><div class="rb-row"><div class="rb-lbl">In Millilitres</div><div class="rb-val">${Math.round(total*1000)} ml</div></div><div class="rb-row"><div class="rb-lbl">Pre-Workout (target)</div><div class="rb-val" style="color:var(--green)">500 ml</div></div><div class="rb-row"><div class="rb-lbl">During Training</div><div class="rb-val">${duringHr} ml/hr</div></div></div>
    <div class="res-advice">Drink ${total}L daily — ${+(total*.3).toFixed(1)}L before 10am to kickstart metabolism, ${+(total*.4).toFixed(1)}L during and around training, and the rest spread through the day. Even 2% dehydration reduces performance by up to 20%.</div>`;
}

// ONE REP MAX
function doORM(){
  const w=+document.getElementById('orm-w').value,r=+document.getElementById('orm-r').value,lift=document.getElementById('orm-l').value;
  if(!w||!r)return;
  const orm=+(w*(1+r/30)).toFixed(1);
  const pcts=[[100,'1RM — Max'],[95,'~2 reps'],[90,'~4 reps'],[85,'~6 reps'],[80,'~8 reps'],[75,'~10 reps'],[70,'~12 reps'],[65,'~15 reps'],[60,'~20 reps']];
  const rows=pcts.map(([p,l])=>`<div class="rb-row"><div class="rb-lbl">${p}% — ${l}</div><div class="rb-val" style="color:${p===100?'var(--blue)':p>=85?'var(--green)':'var(--soft)'}">${+(orm*p/100).toFixed(1)} kg</div></div>`).join('');
  document.getElementById('orm-res').innerHTML=`
    <div class="res-main"><div class="res-big">${orm}</div><div class="res-unit">kg — ${lift} 1RM</div></div>
    <div class="res-bdown">${rows}</div>
    <div class="res-advice">Training zones: Strength 85–95% (1–6 reps), Hypertrophy 67–82% (8–12 reps), Endurance 55–65% (15+ reps). Use these percentages to programme your sets with precision.</div>`;
}

// IDEAL WEIGHT
function doIW(){
  const h=+document.getElementById('iw-h').value,g=document.getElementById('iw-g').value,fr=document.getElementById('iw-f').value;
  if(!h)return;
  const hi=(h-152.4)/2.54;
  const hamwi=g==='m'?48+(2.7*hi):45.5+(2.2*hi);
  const devine=g==='m'?50+(2.3*hi):45.5+(2.3*hi);
  const rob=g==='m'?52+(1.9*hi):49+(1.7*hi);
  const miller=g==='m'?56.2+(1.41*hi):53.1+(1.36*hi);
  const avg=+((hamwi+devine+rob+miller)/4).toFixed(1);
  const adj=+(avg+(fr==='l'?2:fr==='s'?-2:0)).toFixed(1);
  document.getElementById('iw-res').innerHTML=`
    <div class="res-main"><div class="res-big">${adj}</div><div class="res-unit">kg — Ideal Weight (${fr==='s'?'Small':fr==='l'?'Large':'Medium'} Frame)</div></div>
    <div class="res-bdown"><div class="rb-row"><div class="rb-lbl">Hamwi Formula</div><div class="rb-val">${hamwi.toFixed(1)} kg</div></div><div class="rb-row"><div class="rb-lbl">Devine Formula</div><div class="rb-val">${devine.toFixed(1)} kg</div></div><div class="rb-row"><div class="rb-lbl">Robinson Formula</div><div class="rb-val">${rob.toFixed(1)} kg</div></div><div class="rb-row"><div class="rb-lbl">Average</div><div class="rb-val" style="color:var(--blue)">${avg} kg</div></div></div>
    <div class="res-advice">These are scientifically-derived estimates. An elite athlete may healthily exceed these ranges due to muscle mass. Use as a directional target, not an absolute — and pair with a body fat % goal for a more complete picture.</div>`;
}




// TESTIMONIAL SLIDER
let ti=0,ta=null;
const tt=document.getElementById('ttrack'),tds=document.querySelectorAll('.tdot'),tcs=document.querySelectorAll('.tcard');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function updT(){const cw=tcs[0].offsetWidth+28,vis=Math.floor(tt.parentElement.offsetWidth/cw),max=Math.max(0,tcs.length-vis);ti=Math.min(ti,max);tt.style.transform=`translateX(-${ti*cw}px)`;tds.forEach((d,i)=>d.classList.toggle('active',i===ti))}
function startTAuto(){if(reduceMotion)return;ta=setInterval(()=>{ti=(ti+1)%tcs.length;updT()},5000)}
document.getElementById('tnext').addEventListener('click',()=>{ti=Math.min(ti+1,tcs.length-1);updT()});
document.getElementById('tprev').addEventListener('click',()=>{ti=Math.max(ti-1,0);updT()});
tds.forEach((d,i)=>d.addEventListener('click',()=>{ti=i;updT()}));
if(!reduceMotion){
  tt.addEventListener('mouseenter',()=>{if(ta)clearInterval(ta)});
  tt.addEventListener('mouseleave',startTAuto);
}
window.addEventListener('resize',updT);
startTAuto();









// REFERRAL CODE

// ===== VIDEO SLIDER =====
(function(){
  const track    = document.getElementById('vs-track');
  const dotsWrap = document.getElementById('vs-dots');
  const btnPrev  = document.getElementById('vs-prev');
  const btnNext  = document.getElementById('vs-next');
  const ovPrev   = document.getElementById('vs-prev-overlay');
  const ovNext   = document.getElementById('vs-next-overlay');
  const cards    = Array.from(track.querySelectorAll('.vs-card'));
  if(!track || !cards.length) return;

  let current = 0;
  let progressRAF = null;

  // Build dots
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'vs-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.vs-dot'));

  function cardWidth() {
    return cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap || '20');
  }

  function visibleCount() {
    return Math.round(track.parentElement.offsetWidth / cardWidth());
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCount());
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = 'translateX(-' + (current * cardWidth()) + 'px)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= maxIndex();
    ovPrev.disabled = current === 0;
    ovNext.disabled = current >= maxIndex();
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));
  ovPrev.addEventListener('click', () => goTo(current - 1));
  ovNext.addEventListener('click', () => goTo(current + 1));
  window.addEventListener('resize', () => goTo(current));
  goTo(0);

  // ── Play / Pause logic ──────────────────────────────────────
  function stopAllExcept(exceptCard) {
    cards.forEach(card => {
      if(card === exceptCard) return;
      const v = card.querySelector('video');
      if(v && !v.paused) {
        v.pause();
        v.currentTime = 0;
        card.classList.remove('playing');
        resetProgress(card);
      }
    });
    if(progressRAF) { cancelAnimationFrame(progressRAF); progressRAF = null; }
  }

  function resetProgress(card) {
    const fill = card.querySelector('.vs-progress-fill');
    if(fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
  }

  function animateProgress(card, video) {
    const fill = card.querySelector('.vs-progress-fill');
    if(!fill || !video.duration) return;
    fill.style.transition = 'none';
    fill.style.width = ((video.currentTime / video.duration) * 100) + '%';
    progressRAF = requestAnimationFrame(() => animateProgress(card, video));
  }

  cards.forEach(card => {
    const video   = card.querySelector('video');
    const playBtn = card.querySelector('.vs-play');
    const pauseBtn= card.querySelector('.vs-pause');

    if(!video || !playBtn) return;

    // Ensure video never autoplays
    video.autoplay = false;
    video.pause();

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopAllExcept(card);
      video.play().then(() => {
        card.classList.add('playing');
        animateProgress(card, video);
      }).catch(() => {});
    });

    if(pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.pause();
        card.classList.remove('playing');
        if(progressRAF) { cancelAnimationFrame(progressRAF); progressRAF = null; }
      });
    }

    video.addEventListener('ended', () => {
      card.classList.remove('playing');
      resetProgress(card);
      if(progressRAF) { cancelAnimationFrame(progressRAF); progressRAF = null; }
    });

    video.addEventListener('pause', () => {
      card.classList.remove('playing');
    });
  });

  // ── Touch/swipe support ──────────────────────────────────────
  let touchStartX = 0, touchStartY = 0, isDragging = false;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isDragging = false;
  }, {passive:true});
  track.addEventListener('touchmove', e => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if(dx > dy && dx > 8) isDragging = true;
  }, {passive:true});
  track.addEventListener('touchend', e => {
    if(!isDragging) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(diff) > 40) goTo(current + (diff < 0 ? 1 : -1));
    isDragging = false;
  }, {passive:true});

})();
