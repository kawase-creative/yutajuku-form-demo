const times=["終日どこでも","6-8時","8-10時","10-12時","12-14時","14-16時","16-18時","18-20時","20-22時","22-24時"];
document.querySelectorAll("[data-time]").forEach(select=>times.forEach(time=>select.add(new Option(time,time))));

const dateInput=document.querySelector("[data-date]");
const calendar=document.querySelector("[data-calendar]");
const calendarTitle=document.querySelector("[data-calendar-title]");
const calendarDays=document.querySelector("[data-days]");
const prevButton=document.querySelector("[data-prev]");
const nextButton=document.querySelector("[data-next]");
const today=new Date();today.setHours(0,0,0,0);
const maxDate=new Date(today.getFullYear()+2,11,31);
let viewDate=new Date(today.getFullYear(),today.getMonth(),1),selectedDate=null;
const sameDay=(a,b)=>a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();
const renderCalendar=()=>{
  const year=viewDate.getFullYear(),month=viewDate.getMonth();
  calendarTitle.textContent=`${year}年${month+1}月`;
  calendarDays.replaceChildren();
  for(let blank=0;blank<new Date(year,month,1).getDay();blank++)calendarDays.append(document.createElement("span"));
  const lastDay=new Date(year,month+1,0).getDate();
  for(let day=1;day<=lastDay;day++){
    const date=new Date(year,month,day),button=document.createElement("button");
    button.type="button";button.className="calendar-day";button.textContent=String(day);button.setAttribute("aria-label",`${year}年${month+1}月${day}日`);
    if(date.getDay()===0)button.classList.add("is-sunday");if(date.getDay()===6)button.classList.add("is-saturday");
    if(date<today||date>maxDate)button.disabled=true;
    if(sameDay(date,selectedDate)){button.classList.add("is-selected");button.setAttribute("aria-current","date")}
    button.addEventListener("click",()=>{selectedDate=date;dateInput.value=`${year}年${month+1}月${day}日`;dateInput.dataset.iso=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;closeCalendar();renderCalendar()});
    calendarDays.append(button);
  }
  prevButton.disabled=year===today.getFullYear()&&month===today.getMonth();
  nextButton.disabled=year===maxDate.getFullYear()&&month===maxDate.getMonth();
};
const openCalendar=()=>{calendar.hidden=false;dateInput.setAttribute("aria-expanded","true");renderCalendar()};
const closeCalendar=()=>{calendar.hidden=true;dateInput.setAttribute("aria-expanded","false")};
dateInput.addEventListener("click",()=>calendar.hidden?openCalendar():closeCalendar());
dateInput.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();calendar.hidden?openCalendar():closeCalendar()}if(event.key==="Escape")closeCalendar()});
prevButton.addEventListener("click",()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);renderCalendar()});
nextButton.addEventListener("click",()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);renderCalendar()});
document.addEventListener("click",event=>{if(!event.target.closest(".date-picker"))closeCalendar()});

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
  if(!get("date")){dateInput.focus();openCalendar();return}
  const payload={
    "お名前":get("name"),"性別":get("gender"),"年齢":get("age"),
    "メールアドレス":get("email"),_replyto:get("email"),_cc:"m.kawahara@propagateinc.com",
    "面談希望日":get("date"),"面談希望開始時間":get("time"),
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
