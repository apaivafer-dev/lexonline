/**
 * JSGenerator — gera JavaScript nativo inline (<3KB)
 * Zero dependências externas no bundle publicado.
 */

class JSGenerator {
  generate(pageId: string): string {
    let js = `(function(){`;

    // ── Countdown timer ─────────────────────────────────────────────────────
    js += `
document.querySelectorAll('.lex-countdown').forEach(function(el){
  var targetDate=new Date(el.dataset.date).getTime();
  setInterval(function(){
    var now=new Date().getTime();
    var d=targetDate-now;
    if(d<=0){d=0;}
    var days=Math.floor(d/(864e5));
    var hours=Math.floor((d%864e5)/36e5);
    var mins=Math.floor((d%36e5)/6e4);
    var secs=Math.floor((d%6e4)/1e3);
    var dEl=el.querySelector('.cd-d');if(dEl)dEl.textContent=days;
    var hEl=el.querySelector('.cd-h');if(hEl)hEl.textContent=hours;
    var mEl=el.querySelector('.cd-m');if(mEl)mEl.textContent=String(mins).padStart(2,'0');
    var sEl=el.querySelector('.cd-s');if(sEl)sEl.textContent=String(secs).padStart(2,'0');
  },1000);
});`;

    // ── Stats counter (IntersectionObserver) ────────────────────────────────
    js += `
if('IntersectionObserver' in window){
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el=entry.target;
        var target=parseInt(el.dataset.target)||0;
        var valEl=el.querySelector('.sc-val');
        if(!valEl)return;
        var start=0,inc=target/40;
        var t=setInterval(function(){
          start+=inc;
          if(start>=target){valEl.textContent=target;clearInterval(t);}
          else{valEl.textContent=Math.floor(start);}
        },40);
        obs.unobserve(el);
      }
    });
  });
  document.querySelectorAll('.lex-stats-counter').forEach(function(el){obs.observe(el);});
}`;

    // ── Forms — fetch sem reload ─────────────────────────────────────────────
    js += `
document.querySelectorAll('form[data-form-id]').forEach(function(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var data={};
    new FormData(form).forEach(function(v,k){data[k]=v;});
    var btn=form.querySelector('button[type=submit]');
    if(btn)btn.disabled=true;
    fetch('/api/forms/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({pageId:'${pageId}',formId:form.dataset.formId,data:data})
    }).then(function(r){
      if(r.ok){
        var s=form.querySelector('.form-success');
        if(s){s.style.display='block';}else{alert('Enviado com sucesso!');}
        form.reset();
      } else {alert('Erro ao enviar. Tente novamente.');}
    }).catch(function(){alert('Erro de conexão.');})
    .finally(function(){if(btn)btn.disabled=false;});
  });
});`;

    // ── FAQ acordeão — fechar outros ao abrir ───────────────────────────────
    js += `
document.querySelectorAll('.lex-faq details').forEach(function(item){
  item.addEventListener('toggle',function(){
    if(item.open){
      document.querySelectorAll('.lex-faq details[open]').forEach(function(other){
        if(other!==item)other.open=false;
      });
    }
  });
});`;

    // ── LGPD banner — verificar consentimento ───────────────────────────────
    js += `
(function(){
  var banner=document.getElementById('lgpd-banner');
  if(!banner)return;
  if(localStorage.getItem('lgpd-consent')){banner.remove();return;}
  document.getElementById('lgpd-accept')&&document.getElementById('lgpd-accept').addEventListener('click',function(){
    localStorage.setItem('lgpd-consent','accepted');banner.remove();
  });
  document.getElementById('lgpd-reject')&&document.getElementById('lgpd-reject').addEventListener('click',function(){
    localStorage.setItem('lgpd-consent','rejected');banner.remove();
  });
})();`;

    js += `})();`;
    return js;
  }
}

export default new JSGenerator();
