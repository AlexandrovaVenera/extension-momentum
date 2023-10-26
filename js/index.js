
const time = document.getElementById('time');
const dateBlock = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const settingsBlock = document.querySelector('.settings');
const settingModal = document.querySelector('.setting-popup');
const name = document.querySelector('.name');
const languageBtn = document.querySelectorAll('.button-lang');
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const error = document.querySelector('.weather-error');
const humidity = document.querySelector('.humidity')
const wind = document.querySelector('.wind')
const quote = document.querySelector('.quote')
const author = document.querySelector('.author')
const changeQuote = document.querySelector('.change-quote')
const body = document.querySelector('body')
const slideNext = document.querySelector('.slide-next')
const slidePrev = document.querySelector('.slide-prev')

const settingMenuItem = document.querySelectorAll('.nav-item');
const toDo = document.querySelector('.todo-block');
const toDoModal = document.querySelector('.todo-popup');
const todoInput = document.querySelector('.todo-input')
const todoBtn = document.querySelector('.todo-btn')
const trashs = document.querySelectorAll('.todo-menu')
const widgets = document.querySelectorAll('.widgets-toggle-item')


city.value= "Minsk";




let language = 'en';
if(localStorage.getItem('language') != 'ru'){
localStorage.setItem('language', language);
}

let photo
const welcome ={
    ru:['Доброй ночи','Доброе утро', 'Добрый день', 'Добрый вечер'],
    en:['night','morning', 'afternoon', 'evening']
}
const setting = {
  ru:['Язык','Фон','Виджеты','О программе'],
  en:['Language', 'Background', 'Widgets', 'About']
}
const settingWidgets = {
  ru:['Аудио','Погода','Время','Дата','Приветствие','Цитаты','Список задач'],
  en:['Audio', 'Weather', 'Time', 'Date', 'Greeting', 'Quote', 'Todo']
}
let tags
if(localStorage.getItem('tags') == null) {
  tags = {unsplash:[],
          flickr:[]};
}else{
  if(localStorage.getItem('photo') !='git'){
  tags = JSON.parse(localStorage.getItem('tags'))
  document.querySelector(`[data-source-photo = ${localStorage.getItem('photo') }]`).classList.add('active-tags')
  createTagsList(tags,localStorage.getItem('photo') )
  }else if(localStorage.getItem('photo')  == 'git')
    tags = {unsplash:[],
      flickr:[]
    };

}
localStorage.setItem('tags', JSON.stringify(tags))

let newTodo
if(localStorage.getItem('toDoItem')=== null) {
  newTodo = [];
}else{
  newTodo = JSON.parse(localStorage.getItem('toDoItem'))
createTodoList(newTodo)
}
localStorage.setItem('toDoItem', JSON.stringify(newTodo))

let widgetsArr
if(localStorage.getItem('widgetsArr')=== null) {
  widgetsArr = [];
  widgets.forEach(e=>{
  widgetsArr.push({
    id:e.dataset.title,
    hidden: false
  })
})
}else{
  widgetsArr = JSON.parse(localStorage.getItem('widgetsArr'))
}

window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
city.addEventListener('change', getWeather);
changeQuote.addEventListener('click', getQuotes)
slideNext.addEventListener('click', setNextSlider)
slidePrev.addEventListener('click', setPreviousSlider)
settingsBlock.addEventListener('click', toggle);
languageBtn.forEach(el=>el.addEventListener('click', changeLang));

toDo.addEventListener('click',toggleTodo)
trashs.forEach(e=>e.addEventListener('click',deleteTodoItem))

settingMenuItem.forEach(e=>e.addEventListener('click', changePage))
todoInput.addEventListener('keypress', addItem)
todoBtn.addEventListener('click', addItem)
document.querySelectorAll('.input-tag').forEach(el=>el.addEventListener('keypress', addTagItem))
document.querySelectorAll('.tags-block').forEach(el=>el.addEventListener('click', deleteItemTag))
/*------------------------*/


/*Смена фотографии*/

if(localStorage.getItem('photo')=== null) {
  setBg();
  photo = 'git'
  localStorage.setItem('photo', photo)
  if(document.querySelector('.active-photo')){
    document.querySelector('.active-photo').classList.remove('active-photo')
  }
  document.querySelector(`[data-source-photo= ${photo}]`).classList.add('active-photo')

}else{
  photo = localStorage.getItem('photo')
  document.querySelector(`[data-source-photo= ${photo}]`).classList.add('active-photo')
  if(photo == 'git'){
    setBg()
    if(document.querySelector('.active-tags')){
    (document.querySelector('.active-tags').classList.remove('active-tags'))
    }
  }else if(photo == 'unsplash'){
    getLinkToUnsplash(tags['unsplash'])
    toggleTags(photo)
  }else if(photo == 'flickr'){
    getLinkToFlickr(tags['flickr'])
    toggleTags(photo)
  }
}
const photosBtn = document.querySelectorAll('.button-photo')
photosBtn.forEach(el=>el.addEventListener('click', changePhotos))

let sourceOfTags
function changePhotos(e){
  document.querySelector('.active-photo').classList.remove('active-photo')
  e.target.classList.add('active-photo')
  photo = e.target.dataset.sourcePhoto
  localStorage.setItem('photo', photo);
  if(photo == 'git'){
    setBg()
    if(document.querySelector('.active-tags')){
      (document.querySelector('.active-tags').classList.remove('active-tags'))
      }
  }else if(photo == 'unsplash'){
    getLinkToUnsplash(tags['unsplash'])
    toggleTags(photo)
  }else if(photo == 'flickr'){
    getLinkToFlickr(tags['flickr'])
    toggleTags(photo)

  }

}
/*Отображение времени */
function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.innerHTML = currentTime
    showDate(language)
    getTimeOfDay(language)
    setTimeout(showTime, 1000);
    if(language=='en'){
      name.placeholder = 'Enter name'
    }else{
      name.placeholder = 'Введите имя'
    }
}
  showTime();

  function showDate(setting = language){
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC'};
    const currentDate = date.toLocaleDateString(setting, options);
    dateBlock.innerHTML = currentDate.charAt(0).toUpperCase()  +  currentDate.slice(1);
  }
  
/*---------------------------------------------*/
/* Отображения дня*/

function getTimeOfDay(setting = language){
    const date = new Date();
    let hours = date.getHours();
    language == 'en'? greeting.innerHTML = `Good ${welcome[setting][Math.floor(hours/6)]}`: greeting.innerHTML = welcome[setting][Math.floor(hours/6)]
    return Math.floor(hours/6)

}
/*--------------------*/

/*Открытие/закрытие блока settings */
function toggle(){
  settingModal.classList.toggle('active')
  settingsBlock.classList.toggle('settings-show')
}

/*-------------------------------*/
/*Изменение языка Settings*/
function changeLangSet(language){
  settingMenuItem.forEach((el,index)=>el.textContent = setting[language][index])
  document.querySelectorAll('.setting-title').forEach((el,index)=>el.textContent = setting[language][index])
  document.querySelectorAll('.slide-toggle-name').forEach((el,index)=>el.textContent = settingWidgets[language][index])
  language==='en'? toDo.textContent = 'ToDo': toDo.textContent = 'Список задач'
  
}
changeLangSet(language)
/*Открытик/закрытие блока todo*/
function toggleTodo(){
  toDoModal.classList.toggle('active')
}

/*Сохранение изменений в localStorage*/
function setLocalStorage() {
  localStorage.setItem('name', name.value);
  localStorage.setItem('language', language);
  localStorage.setItem('city', city.value);
  
}
/*-----------------------------*/

/*Восстановление данных после перезагрузки страницы*/
function getLocalStorage() {
    name.value = localStorage.getItem('name');
    language = localStorage.getItem('language')
    if(localStorage.getItem('city')){
    city.value = localStorage.getItem('city')
    }
    changeWidgets(widgetsArr)
    createLang(localStorage.getItem('language'))
    changeLangSet(language)
    getQuotes(language);
    getWeather();
    

}
/*---------------------------*/
/*Построение страницы языка после перезагрузки*/
function createLang(language){
  document.querySelector('.active-lang').classList.remove('active-lang')
  document.querySelector(`[data-lang = ${language}]`).classList.add('active-lang')
}
/* Изменения языка*/
function changeLang(e){
  if(language!=e.target.dataset.lang){
  document.querySelector('.active-lang').classList.remove('active-lang')
  e.target.classList.add('active-lang')
  language = e.target.dataset.lang;
  localStorage.setItem('city', city.value);

  //localStorage.setItem('language', language);
  if(localStorage.getItem('city')=='Minsk' || localStorage.getItem('city')=='Минск'){
  language=='en'? city.value="Minsk": city.value="Минск";
  }
  getWeather();
  getQuotes(language);
  changeLangSet(language)
}
}
/*---------------------------------*/
/*Погода*/
async function getWeather() { 

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${language}&appid=886d64473e9c8a78fb201603c001c3d6&units=metric`;
  const res = await fetch(url);
  const data = await res.json(); 
  let textHum
  let textWind
  let textSpeed
  if(language==='en'){
    textHum='Humidity'
    textWind='Wind'
    textSpeed='m/s'
  }else{
    textHum='Давление'
    textWind='Ветер'
    textSpeed='м/с'
  }
    if (res.ok){
      error.textContent = '';
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${Math.round(data.main.temp)}°C`;
      weatherDescription.textContent = data.weather[0].description
      humidity.textContent = ` ${textHum}: ${Math.round(data.main.humidity)}%`
      wind.textContent = `${textWind}: ${Math.round(data.wind.speed)} ${textSpeed}`
    
  }else{
      error.textContent = data.message;
      temperature.textContent = ''
      wind.textContent = '' 
      weatherDescription.textContent=''
      humidity.textContent = ''

  }
}
getWeather()

/*----------------------------------*/

/*Цитаты*/
async function getQuotes() {  
  const quotes = 'data.json';
  const res = await fetch(quotes);
  const data = await res.json(); 
  let numQuote = getRandomNum(0,data[language].length-1)
  author.textContent = (data[language][numQuote]).author
  quote.textContent = `"${(data[language][numQuote]).text}"`
}
/*------------------------------*/

/*Random*/
function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

/*--------------------------------- */


/* Изменение background*/
function setBg(){
  let number = String(getRandomNum(1,20))
  number.length==1? number = '0'+ number: number
  let day = getTimeOfDay();
  const img = new Image()
  img.src = `./assets/images/${welcome['en'][day]}/${number}.jpg`
  img.addEventListener('load', () => {
    body.style.backgroundImage= `url('${img.src}')` 
    
  });   
}


/*--------------------------------------------*/
/*Изменение background*/
function setNextSlider(){
  if(photo == 'git'){
  let re = String(body.style.backgroundImage.match(/[0-9]+/g))
  re = re.substring(re.length-2)
  let next
  if (re =='20'){
    next = '01'
  }else if(re[0]== 0 && re[1]<9){
   next = String(re[0])+String(+re[1]+1)
  }else{
   next = Number(re)+1
  }
  const img = new Image()
  let day = getTimeOfDay();
  img.src = `./assets/images/${welcome['en'][day]}/${next}.jpg`
   img.addEventListener('load', () => {
    body.style.backgroundImage= `url('${img.src}')` 
    
  });
}else if(photo == 'unsplash'){
  getLinkToUnsplash(tags['unsplash'])
}else if(photo == 'flickr'){
  getLinkToFlickr(tags['flickr'])
}
}

function setPreviousSlider(){
  if(photo == 'git'){
  let re = String(body.style.backgroundImage.match(/[0-9]+/g))
  re = re.substring(re.length-2)
  let next
  if (re =='01'){
    next = '20'
  }else if(re[0]== 0 && re[1]<=9){
   next = String(re[0])+String(+re[1]-1)
  }else if(re =='10') {
          next = '09'
      }
  else{
      next = Number(re)-1
  }
  const img = new Image()
  let day = getTimeOfDay();
  img.src = `./assets/images/${welcome['en'][day]}/${next}.jpg`
   img.addEventListener('load', () => {
    body.style.backgroundImage= `url('${img.src}')` 
    
  });
}else if(photo == 'unsplash'){
  getLinkToUnsplash(tags['unsplash'])
}else if(photo == 'flickr'){
  getLinkToFlickr(tags['flickr'])
}
}
/*-------------------------------*/
/*Backgound in API*/
async function getLinkToUnsplash(value) {
  Array.isArray(value)? value = value.join(', '): value
  const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${value}&client_id=o6UNz_dcWlhjOhvHz0terZFpmd9XWmFjYuRbcx9TZfo`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if(data.errors){
          if(language = 'en'){
            document.querySelector('.not-tip').textContent =  'This tag is not provided.'
          }else{
            document.querySelector('.not-tip').textContent =  'Такой тег не предусмотрен'
          }
      document.querySelector('.not-tip').classList.add('active-not-tip')
        //getLinkToUnsplash()
      }else{
        
      const img = new Image()
      img.src = data.urls.regular
      img.addEventListener('load', () => {
      body.style.backgroundImage= `url('${img.src}')` 
    });
  }
  });
          
  }
  
  
 /*---------------------------*/
 /*Backgound in API*/
async function getLinkToFlickr(value) {
  Array.isArray(value)? value = value.join(', '): value
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=999c45f90164027003b6dcce5389562e&tags=${value}&extras=url_h&format=json&nojsoncallback=1`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if(data.errors){
        if(language = 'en'){
          document.querySelector('.not-tip').textContent =  'This tag is not provided.'
        }else{
          document.querySelector('.not-tip').textContent =  'Такой тег не предусмотрен'
        }
    document.querySelector('.not-tip').classList.add('active-not-tip')
      //getLinkToUnsplash()
    }else{
      const img = new Image()
      let photos = data.photos.photo;
      let numIndex =  Math.round(Math.random(0, 1) * photos.length)
      img.src = data.photos.photo[numIndex].url_h
      img.addEventListener('load', () => {
      body.style.backgroundImage= `url('${img.src}')` 
      
    });
  }

        });
  }
 /*---------------------------*/


 
/*Изменение страницы Setting*/
function changePage(e){
  if( e.target!= document.querySelector('.active-item')){
    let menu = e.target.dataset.setting
  document.querySelector('.active-item').classList.remove('active-item')
  document.querySelector('.active-setting').classList.remove('active-setting')
  document.querySelector(`[data-active = ${menu}]`).classList.add('active-setting')
  e.target.classList.add('active-item')
  }

}
/*----------------------------------------*/
/*Добавление todo item*/
function addItem(e){
  if ((e.key === 'Enter' || e.target == todoBtn)&& todoInput.value != '') {
    let data = new Date()
    let id = data.getDate().toString()+data.getMonth()+data.getFullYear().toString()+data.getTime().toString()
    let temp={
      id: id,
      todo:todoInput.value,
      status:false
    }
    newTodo[newTodo.length] = temp
    todoInput.value = ''
    createTodoList(newTodo)
    localStorage.setItem('toDoItem', JSON.stringify(newTodo))

}
}

function createTodoList(array){
  if(array.length==0){
    document.querySelector('.todo-menu').innerHTML = ''
  }else{
  let out = ''
  for (let key in array){    

   
    if(array[key].status==false){
      out += `
      <li class="todo-item" data-id-item=${array[key].id}> <input type="checkbox" ><span class="todo-item-input"></span>${array[key].todo}
      <img src="./assets/svg/trash.svg" alt='trash' class='trash'>
            </li>
      `
    }else{
      out += `
      <li class="todo-item" data-id-item=${array[key].id}> <input type="checkbox" ><span class="todo-item-input checked"></span>${array[key].todo}
      <img src="./assets/svg/trash.svg" alt='trash' class='trash'>
            </li>
      `
    }
    document.querySelector('.todo-menu').innerHTML = out
  }
  }
}
/*----------------------*/
/*Удаление или изменение данных из todolist*/
function deleteTodoItem(e){
  if(e.target.tagName === 'IMG'){
    newTodo = newTodo.filter(el=> el.id!==e.target.parentNode.dataset.idItem)
  }
  else if(e.target.tagName === "SPAN"){
   
    newTodo.filter(el=>{
        if(el.todo == e.target.parentNode.textContent.trim()){
          
          if(el.status==false){
            el.status=true
            }
            else{
              el.status=false
            }
      }})
    }
    localStorage.setItem('toDoItem', JSON.stringify(newTodo))
    createTodoList(newTodo)
    
  
  }
/*--------------------------- */

/*Открытие/закрытие widgets */

widgets.forEach(e=>e.addEventListener('click',e=>{
  let data_id = e.currentTarget.dataset.title
   widgetsArr.forEach(el=>{
   if(el['id'] == data_id && el['hidden']===false){
    el['hidden']=true}
    else if(el['id'] == data_id && el['hidden']===true){
      el['hidden']=false}
      else{}
    
  })
  changeWidgets(widgetsArr)
  localStorage.setItem('widgetsArr', JSON.stringify(widgetsArr))
  }))


/*------------------------------*/
/*Построение страницы Widgets*/
function changeWidgets(array){
  array.forEach(el=>{
    if(el['hidden']==true){
      document.querySelector(`[data-widget= ${el['id']}]`).classList.add('hidden')
      document.querySelector(`[data-title= ${el['id']}]`).classList.remove('on')
      document.querySelector(`[data-h2= ${el['id']}]`).classList.remove('on')
      if(el['id']==='todo'&&document.querySelector('.todo-popup.active')){
        document.querySelector('.todo-popup.active').classList.remove('active')
      }}
    else if((el['hidden']==false)){
      document.querySelector(`[data-widget= ${el['id']}]`).classList.remove('hidden')
      document.querySelector(`[data-title= ${el['id']}]`).classList.add('on')
      document.querySelector(`[data-h2= ${el['id']}]`).classList.add('on')

    }
    })
}

/*-------------------*/
/*Открытие/закрытие tags*/

function toggleTags(source){
if (document.querySelector('.active-tags') != null){
(document.querySelector('.active-tags').classList.remove('active-tags'))
}
document.querySelector(`.${source}_tags`).classList.add('active-tags')
createTagsList(tags,document.querySelector('.active-tags').children[0].dataset.input)

}

/*Добавление tags item*/
function addTagItem(e){
  if ((e.key === 'Enter')&& e.target.value != '') {
  
    if(tags[e.target.dataset.input].includes(e.target.value)){
      if(language='en'){
        document.querySelector('.tip').textContent = 'This value already exists.'
      }else{
        document.querySelector('.tip').textContent = 'Такое значение уже есть.'
      }
      document.querySelector('.tip').classList.add('active-tip')
    }else{
      
      document.querySelector('.tip').classList.remove('active-tip')
    tags[e.target.dataset.input].push(e.target.value)
    e.target.value = ''
    createTagsList(tags,e.target.dataset.input)
    localStorage.setItem('tags', JSON.stringify(tags))
    if(photo == 'unsplash'){
      getLinkToUnsplash(tags['unsplash'])
    }else if(photo == 'flickr'){
      getLinkToFlickr(tags['flickr'])
    }
    }
  }
}

function createTagsList(array,input){
  if(array[input]==0){
    document.querySelector(`.${input}.tags-block`).innerHTML = ''
  }else{
  let out = ''
  for (let key in array[input]){    
    out += `
    <span class="tag-text" data-tag-source=${input}>${tags[input][key]}<img src='./assets/svg/close.svg' alt='trash' class="close-tag"></span>
          `
   document.querySelector(`.${input}.tags-block`).innerHTML = out
  }
  }

}


/*-------------------------*/
/*Удаление тегов*/


function deleteItemTag(e){
  if(e.target.tagName === 'IMG'){
let currentClose = e.target
let index= tags[currentClose.parentNode.dataset.tagSource].indexOf(e.target.parentNode.textContent)
tags[currentClose.parentNode.dataset.tagSource].splice(index,1)
localStorage.setItem('tags', JSON.stringify(tags))
createTagsList(tags,currentClose.parentNode.dataset.tagSource)
if(photo == 'unsplash'){
  getLinkToUnsplash(tags['unsplash'])
}else if(photo == 'flickr'){
  getLinkToFlickr(tags['flickr'])
}
  }
}

/*----------------------------*/
