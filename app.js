const times=["10:00〜","11:00〜","13:00〜","14:00〜","15:00〜","16:00〜","17:00〜","18:00〜","19:00〜"];
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
    "姓":get("lastName"),"名":get("firstName"),"せい":get("lastKana"),"めい":get("firstKana"),
    "性別":get("gender"),"お住まい":get("prefecture"),"生年月日":get("birthday"),"電話番号":get("tel"),
    "メールアドレス":get("email"),email:get("email"),"ゆた塾を知ったきっかけ":get("source"),
    "相談希望日（第一希望）":get("date1"),"希望開始時間（第一希望）":get("time1"),
    "相談希望日（第二希望）":get("date2"),"希望開始時間（第二希望）":get("time2"),
    "相談希望日（第三希望）":get("date3"),"希望開始時間（第三希望）":get("time3"),
    "相談のご意向":get("intent"),"相談で質問したいこと等":get("message"),
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
