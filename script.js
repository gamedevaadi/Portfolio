
(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero title: letter by letter blur-in */
  var h1=$('#h1');'Aditya Kumar'.split('').forEach(function(c,i){var s=document.createElement('span');s.className='ch';s.textContent=c===' '?' ':c;s.style.animationDelay=(.3+i*.09)+'s';h1.appendChild(s)});
    /* statement word reveal */
  var st=$('#statement'),nodes=[];
  (function split(el){[].slice.call(el.childNodes).forEach(function(n){
    if(n.nodeType===3){var f=document.createDocumentFragment();n.textContent.split(/\s+/).filter(Boolean).forEach(function(w){var s=document.createElement('span');s.textContent=w;f.appendChild(s);nodes.push(s)});el.replaceChild(f,n)}
    else if(n.nodeType===1){var w=n.textContent;n.textContent='';var s=document.createElement('span');s.textContent=w;n.appendChild(s);nodes.push(s)}})})(st);
  function wordsOn(){var r=st.getBoundingClientRect(),p=(innerHeight*.85-r.top)/(r.height+innerHeight*.35);var k=Math.max(0,Math.min(1,p))*nodes.length*1.15;nodes.forEach(function(n,i){n.classList.toggle('on',i<k||reduce)})}

  /* reveal on scroll + count up */
  function count(el){var n=+el.dataset.n,s=el.dataset.s,t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1800);el.textContent=Math.round(n*(1-Math.pow(1-p,4)))+s;if(p<1)requestAnimationFrame(f)})(t0)}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting&&e.boundingClientRect.top>=0)return;var t=e.target;
    t.style.transitionDelay=(t.dataset.d||0)+'s';t.classList.add('in');$$('[data-n]',t).forEach(count);io.unobserve(t)})},{threshold:.12});
  $$('.rv').forEach(function(el,i){el.dataset.d=(i%3)*.12;io.observe(el)});

  /* parallax + nav + words */
  var scene=$('#scene'),castle=$('#castle'),blobs=$$('.blob[data-p]'),nav=$('#nav'),night=$('#contact'),ticking=false;
  function onScroll(){var y=scrollY;
    if(!reduce){castle.style.transform='translateX(-50%) translateY('+(y*-.12)+'px)';blobs.forEach(function(b){b.style.marginBottom=(-y*b.dataset.p/100)+'px'});}
    var nr=night.getBoundingClientRect();nav.classList.toggle('night',nr.top<120);wordsOn();ticking=false}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

  /* cursor glow */
  var glow=$('#glow'),gx=0,gy=0,tx=0,ty=0;
  if(matchMedia('(pointer:fine)').matches&&!reduce){
    addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY;glow.style.opacity=1;
      var cx=(e.clientX/innerWidth-.5),cy=(e.clientY/innerHeight-.5);scene.style.transform='translate('+(cx*-18)+'px,'+(cy*-10)+'px)'});
    (function loop(){gx+=(tx-gx)*.08;gy+=(ty-gy)*.08;glow.style.transform='translate('+gx+'px,'+gy+'px)';requestAnimationFrame(loop)})();
  }

  /* drifting blurred crowd */
  var ppl=$('#people'),cols=['#2f6fd6','#ff5a2c','#ffd02a','#1fae5a','#0e1b4d','#ffffff','#f26aa2','#12a4a0','#1b1c35','#ff9f3a'],ns='http://www.w3.org/2000/svg';
  function rnd(a,b){return a+Math.random()*(b-a)}
  for(var i=0;i<34;i++){
    var near=Math.random()>.55,sc=near?rnd(1.3,1.9):rnd(.6,1.0),x=rnd(20,1180),y=near?rnd(170,330):rnd(50,170),c=cols[i%cols.length];
    var g=document.createElementNS(ns,'g');g.setAttribute('class','fig');g.style.setProperty('--d',rnd(5,11)+'s');g.style.setProperty('--wx',rnd(-40,40)+'px');g.style.setProperty('--wy',rnd(-8,8)+'px');g.style.animationDelay=(-rnd(0,8))+'s';
    g.setAttribute('filter','url(#'+(near?'bl2':'bl1')+')');
    g.innerHTML='<g transform="translate('+x+','+y+') scale('+sc+')"><circle cx="0" cy="-60" r="13" fill="#e9835a"/><path d="M-12 -66 q12 -18 24 0 l0 -6 q-12 -12 -24 0z" fill="#1b1c35"/><rect x="-22" y="-44" width="44" height="78" rx="20" fill="'+c+'"/><rect x="-16" y="30" width="14" height="52" rx="6" fill="'+cols[(i+3)%cols.length]+'"/><rect x="3" y="30" width="14" height="52" rx="6" fill="'+cols[(i+5)%cols.length]+'"/></g>';
    ppl.appendChild(g);
  }

  /* falling snow in night section */
  var cv=$('#snow'),cx=cv.getContext('2d'),flakes=[];
  function rs(){cv.width=night.offsetWidth;cv.height=night.offsetHeight}rs();addEventListener('resize',rs);
  for(var k=0;k<110;k++)flakes.push({x:Math.random(),y:Math.random(),r:Math.random()*1.8+.4,s:Math.random()*.35+.1,d:Math.random()*6});
  var snowOn=false;new IntersectionObserver(function(e){snowOn=e[0].isIntersecting}).observe(night);
  (function snow(t){if(snowOn&&!reduce){cx.clearRect(0,0,cv.width,cv.height);cx.fillStyle='rgba(255,255,255,.75)';
    flakes.forEach(function(f){f.y+=f.s/800*16;f.x+=Math.sin(t/1500+f.d)*.0004;if(f.y>1){f.y=-.02;f.x=Math.random()}cx.beginPath();cx.arc(f.x*cv.width,f.y*cv.height,f.r,0,6.3);cx.fill()})}
    requestAnimationFrame(snow)})(0);

  /* easter eggs */
  var tel=$('#toast'),tt;function toast(m){tel.textContent=m;tel.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){tel.classList.remove('show')},3200)}
  console.log('%cSoft signals','font:italic 28px Georgia;color:#e0359a');console.log('%cthere are a few lights to switch on. try clicking the castle, the glowing house, or the Konami code.','color:#6a6d86');
  var lit=false;$('#castle').addEventListener('click',function(){lit=!lit;castle.classList.toggle('lit',lit);toast(lit?'The windows are lit.':'Goodnight, castle.')});
  var wins=$$('.lw'),on=true;
  function pop(el,x,y){for(var i=0;i<18;i++){var d=document.createElement('i');d.style.cssText='position:fixed;z-index:9999;pointer-events:none;border-radius:50%;width:8px;height:8px;left:'+x+'px;top:'+y+'px;background:'+['#ff5fa8','#ffd23f','#5b8def','#7be0b4'][i%4]+';box-shadow:0 0 14px currentColor;transition:all 1.4s cubic-bezier(.2,.8,.2,1);opacity:1';document.body.appendChild(d);
    (function(d){requestAnimationFrame(function(){d.style.transform='translate('+rnd(-160,160)+'px,'+rnd(-220,40)+'px) scale(.2)';d.style.opacity=0});setTimeout(function(){d.remove()},1500)})(d)}}
  $('#plume').addEventListener('click',function(e){pop(null,e.clientX,e.clientY);toast('Somebody is home.')});
  var pc=0;$$('.lw').forEach(function(w){w.style.cursor='pointer';w.style.transition='opacity .4s';w.addEventListener('click',function(){w.style.opacity=w.style.opacity==='0.15'?1:.15;if(++pc%4===0)toast('Lights out. Lights on.')})});
  var kon=[38,38,40,40,37,39,37,39,66,65],ki=0,dusk=false;
  addEventListener('keydown',function(e){ki=(e.keyCode===kon[ki])?ki+1:(e.keyCode===kon[0]?1:0);if(ki===kon.length){ki=0;dusk=!dusk;document.body.classList.toggle('dusk',dusk);toast(dusk?'Colors are drifting. Press it again to stop.':'Colors settled.')}});
  var lc=0;h1.addEventListener('click',function(e){lc++;if(lc===5){lc=0;pop(null,e.clientX,e.clientY);toast('You found the name. Nice to meet you, I’m Kajal.')}});
  $$('.stat b').forEach(function(b){b.parentNode.addEventListener('click',function(e){pop(null,e.clientX,e.clientY)})});

  /* ===== more easter eggs ===== */
  function shoot(x,y){var d=document.createElement('div'),a=rnd(18,32);d.className='shoot';d.style.left=x+'px';d.style.top=y+'px';d.style.setProperty('--a',a+'deg');d.style.setProperty('--tx',(Math.cos(a*Math.PI/180)*520)+'px');d.style.setProperty('--ty',(Math.sin(a*Math.PI/180)*520)+'px');document.body.appendChild(d);setTimeout(function(){d.remove()},1400)}
  function wish(){shoot(innerWidth*rnd(.05,.4),innerHeight*rnd(.05,.25));setTimeout(function(){shoot(innerWidth*rnd(.3,.6),innerHeight*rnd(.05,.2))},350);toast('Make a wish.')}
  /* crowd people say hi */
  var hi=['hi!','nice to meet you','have you tried turning it off and on?','your SAML assertion is valid','you are not alone in this queue','coffee?','ticket resolved','good morning, wherever you are','try clicking the castle','I read your resume. Hire her.'];
  $$('.fig').forEach(function(f){f.addEventListener('click',function(){
    f.animate([{transform:'translateY(0)'},{transform:'translateY(-44px)'},{transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.3,1.6,.5,1)',composite:'add'});
    var b=f.getBoundingClientRect(),el=document.createElement('div');el.className='bub';el.textContent=hi[Math.random()*hi.length|0];el.style.left=(b.left+b.width/2)+'px';el.style.top=b.top+'px';document.body.appendChild(el);
    requestAnimationFrame(function(){el.classList.add('show')});setTimeout(function(){el.classList.remove('show');setTimeout(function(){el.remove()},500)},2200)})});
  /* click the night sky for shooting stars */
  night.addEventListener('click',function(e){if(e.target.closest('a,.plume,svg.village,.cbtn'))return;shoot(e.clientX,e.clientY);if(Math.random()>.7)toast('Make a wish.')});
  /* idle on the hero: a quiet shooting star */
  var idleT,idled=false;function idleReset(){clearTimeout(idleT);idleT=setTimeout(function(){if(scrollY<innerHeight&&!idled){idled=true;castle.classList.add('lit');lit=true;wish();toast('Still here? Take your time. The windows are lit.')}},30000)}
  ['mousemove','scroll','keydown','touchstart'].forEach(function(t){addEventListener(t,idleReset,{passive:true})});idleReset();
  /* cursor trail (command: trail) */
  var trailOn=false,tcols=['#ff5fa8','#ffd23f','#5b8def','#7be0b4','#ff7a45'],tl=0;
  addEventListener('mousemove',function(e){if(!trailOn)return;var n=Date.now();if(n-tl<28)return;tl=n;var d=document.createElement('div');d.className='trail';d.style.left=e.clientX+'px';d.style.top=e.clientY+'px';d.style.background=tcols[Math.random()*tcols.length|0];document.body.appendChild(d);setTimeout(function(){d.remove()},1100)});
  /* blizzard (command: snow) */
  function blizzard(){for(var k=0;k<260;k++)flakes.push({x:Math.random(),y:-Math.random(),r:Math.random()*2.2+.5,s:Math.random()*.9+.4,d:Math.random()*6});setTimeout(function(){flakes.length=110},9000);night.scrollIntoView({behavior:'smooth',block:'start'});toast('It is snowing.')}
  /* cinematic tour (command: tour) */
  var touring=false,tids=['top','about','work','crowd','projects','skills','rec','contact'];
  function stopTour(){touring=false}
  ['wheel','touchstart','keydown'].forEach(function(t){addEventListener(t,stopTour,{passive:true})});
  function tour(){touring=true;toast('Tour started. Scroll or press any key to stop.');var i=0;(function step(){if(!touring||i>=tids.length)return;var el=document.getElementById(tids[i++]);el.scrollIntoView({behavior:'smooth',block:tids[i-1]==='crowd'?'center':'start'});setTimeout(step,3600)})()}
  /* command palette */
  var pal=$('#pal'),pin=$('#pin'),pout=$('#pout');
  function say(t){pout.innerHTML+=t+'\n';pout.scrollTop=pout.scrollHeight}
  function openPal(){pal.classList.add('open');if(!pout.innerHTML)say('The house is listening. Try <b>help</b>.');setTimeout(function(){pin.focus()},60)}
  function closePal(){pal.classList.remove('open');pin.blur()}
  pal.addEventListener('click',function(e){if(e.target===pal)closePal()});
  var C={
    help:function(){say('<b>whoami</b>  <b>hire</b>  <b>coffee</b>  <b>wish</b>  <b>snow</b>  <b>trail</b>  <b>dusk</b>  <b>tour</b>  <b>okta</b>  <b>clear</b>  <b>exit</b>')},
    whoami:function(){say('<b>Aditya Kumar</b>, an engineer in Bangalore.\nAt Okta I untangle enterprise identity problems and own the incidents that keep people up at night. I build AI tools that make support teams faster, and gadgets that help people see their way.')},
    hire:function(){say('Great taste. kajalkbiju25@gmail.com');wish()},
    coffee:function(){say('brewing...\n   ( (\n    ) )\n  ........\n  |      |]\n  \\      /\n   `----\'\n ready. no sugar, lots of fog.')},
    wish:function(){closePal();wish()},
    snow:function(){closePal();blizzard()},
    trail:function(){trailOn=!trailOn;say(trailOn?'Your cursor is painting now.':'Trail off.');if(trailOn)closePal()},
    dusk:function(){dusk=!dusk;document.body.classList.toggle('dusk',dusk);say(dusk?'Colors drifting.':'Colors settled.')},
    tour:function(){closePal();tour()},
    okta:function(){closePal();verify()},
    clear:function(){pout.innerHTML=''},
    exit:closePal
  };
  pin.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Escape'){closePal();return}
    if(e.key!=='Enter')return;var v=pin.value.trim().toLowerCase();pin.value='';if(!v)return;say('<b>&gt;</b> '+v);
    if(v.indexOf('sudo')===0){say('Nice try. This house does not do sudo.');return}
    (C[v]||function(){say('No such room: '+v+'. Try help.')})()});
  /* fake Okta Verify push (type okta anywhere) */
  function verify(){if($('.mfa'))return;var m=document.createElement('div');m.className='mfa';m.innerHTML='<b>Okta Verify</b><p>Did you just try to sign in to <i>kajal.world</i>?</p><div class="bt"><button>Yes, it’s me</button><button>No</button></div>';document.body.appendChild(m);
    $$('button',m).forEach(function(b,n){b.onclick=function(){m.remove();toast(n?'Reported. (kidding, I know it was you.)':'Approved. Welcome in.');if(!n)wish()}});setTimeout(function(){m.remove()},10000)}
  var buf='';
  addEventListener('keydown',function(e){
    if(e.key==='/'&&document.activeElement.tagName!=='INPUT'){e.preventDefault();pal.classList.contains('open')?closePal():openPal();return}
    if(e.key==='Escape'&&pal.classList.contains('open')){closePal();return}
    if(e.key.length===1&&!pal.classList.contains('open')){buf=(buf+e.key.toLowerCase()).slice(-6);if(buf.slice(-4)==='okta'){buf='';verify()}if(buf.slice(-4)==='wish'){buf='';wish()}}
  });
  /* 44 tests passing */
  $$('.stat').forEach(function(c){if(c.textContent.indexOf('automated tests')>-1)c.addEventListener('click',function(){toast('44 passed, 0 failed. Green across the board.')})});
  console.log('%cpress / to talk to the house','color:#e0359a;font:italic 16px Georgia');
})();
