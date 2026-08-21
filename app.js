const times=["終日どこでも","6-8時","8-12時","12-14時","14-16時","16-18時","18-20時","20-22時","22-24時"];
document.querySelectorAll("[data-time]").forEach(select=>times.forEach(time=>select.add(new Option(time,time))));

const yearSelect=document.querySelector("[data-year]");
const monthSelect=document.querySelector("[data-month]");
const daySelect=document.querySelector("[data-day]");
const today=new Date();
for(let year=today.getFullYear();year<=today.getFullYear()+2;year++)yearSelect.add(new Option(`${year}年`,String(year)));
const updateMonths=()=>{
  const selected=monthSelect.value;
  monthSelect.length=1;
  const year=Number(yearSelect.value);
  const first=year===today.getFullYear()?today.getMonth()+1:1;
  for(let month=first;month<=12;month++)monthSelect.add(new Option(`${month}月`,String(month)));
  if([...monthSelect.options].some(option=>option.value===selected))monthSelect.value=selected;
  updateDays();
};
const updateDays=()=>{
  const selected=daySelect.value;
  daySelect.length=1;
  const year=Number(yearSelect.value),month=Number(monthSelect.value);
  daySelect.disabled=!(year&&month);
  if(!(year&&month))return;
  const last=new Date(year,month,0).getDate();
  const first=year===today.getFullYear()&&month===today.getMonth()+1?today.getDate():1;
  for(let day=first;day<=last;day++)daySelect.add(new Option(`${day}日`,String(day)));
  if([...daySelect.options].some(option=>option.value===selected))daySelect.value=selected;
};
yearSelect.addEventListener("change",updateMonths);
monthSelect.addEventListener("change",updateDays);

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
  const preferredDate=`${get("dateYear")}年${get("dateMonth")}月${get("dateDay")}日`;
  const payload={
    "お名前":get("name"),"性別":get("gender"),"年齢":get("age"),
    "メールアドレス":get("email"),_replyto:get("email"),_cc:"1641494papa@gmail.com",
    "面談希望日":preferredDate,"面談希望開始時間":get("time"),
    "上記以外の都合の良い日時":get("alternativeDate"),"面談で質問したい事":get("message"),
    _subject:"【ゆた塾】オンライン個別相談のお申し込み",_template:"table",_captcha:"false",
    _url:"https://kawase-creative.github.io/yutajuku-form-demo/"
  };
  submitButton.disabled=true;submitButton.textContent="送信しています…";errorMessage.hidden=true;
  try{
    const response=await fetch("https://formsubmit.co/ajax/info@yutajuku.jp",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(payload)});
    if(!response.ok)throw new Error();
    form.hidden=true;success.hidden=false;document.getElementById("entry").scrollIntoView({behavior:"smooth"});
  }catch{errorMessage.hidden=false}
  finally{submitButton.disabled=false;submitButton.textContent="入力内容を送信する"}
});

document.getElementById("back-button").addEventListener("click",()=>{success.hidden=true;form.hidden=false});
