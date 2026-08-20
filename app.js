const times=["終日どこでも","9-12時","12-14時","14-16時","16-18時","18-20時","20-22時"];
document.querySelectorAll("[data-time]").forEach(select=>times.forEach(time=>select.add(new Option(time,time))));

const form=document.getElementById("entry-form");
const success=document.getElementById("success");
const errorMessage=form.querySelector(".form-error");
const submitButton=form.querySelector(".submit-button");
const value=data=>name=>String(data.get(name)??"");

form.addEventListener("submit",async event=>{
  event.preventDefault();
  const data=new FormData(form);
  if(data.get("_honey"))return;
  const get=value(data);
  const payload={
    "お名前":get("name"),"性別":get("gender"),"年齢":get("age"),
    "メールアドレス":get("email"),_replyto:get("email"),
    "面談希望日":get("date"),"面談希望開始時間":get("time"),
    "上記以外の都合の良い日時":get("alternativeDate"),"面談で質問したい事":get("message"),
    _subject:"【ゆた塾】オンライン個別相談のお申し込み",_template:"table",_captcha:"false",
    _url:"https://kawase-creative.github.io/yutajuku-form-demo/"
  };
  submitButton.disabled=true;submitButton.textContent="送信しています…";errorMessage.hidden=true;
  try{
    const response=await fetch("https://formsubmit.co/ajax/1641494papa@gmail.com",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)});
    if(!response.ok)throw new Error();
    form.hidden=true;success.hidden=false;document.getElementById("entry").scrollIntoView({behavior:"smooth"});
  }catch{errorMessage.hidden=false}
  finally{submitButton.disabled=false;submitButton.textContent="入力内容を送信する"}
});

document.getElementById("back-button").addEventListener("click",()=>{success.hidden=true;form.hidden=false});
