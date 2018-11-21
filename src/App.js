import React, { Component } from 'react';

class App extends Component {
  state = {
    inputValue: '',//value поля поиска
    isLoad: false,//Загружены ли данные
    loadPreviewShow: false,//Показывать ли полосу загрузки
    sorted: false,//сортированы ли данные
    unfoldedInfo: [],//Подробная информация о пользователе
    columnList:{//Необходимо для проверки сортировки
      id: false,
      firstName: false,
      lastName: false,
      email: false,
      phone: false
    },
    downloaded: [],//обработанный массив данных
    showTable: 0,//Отображаемая сейчас страница с частью данных таблицы, поу молчанию необхоидмо любое значение индикатор
    showPageNumber: 0,//Номер страницы с данными таблицы
    reRenderTable: false,//Необходим ли ререндер
    searching: false//Пользователь ищет что-то?
  }
  //Загрузка данных
  loadData = (url) => {
      let trans = (data) =>{
        let inter = JSON.parse(data)
        this.setState({downloaded: inter, loadPreviewShow: false, isLoad: true})
      }
      this.setState({loadPreviewShow: true, isLoad: false})
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function(){
        trans(xhr.responseText)
      }
      xhr.onerror = function() {
        console.log( 'Ошибка ' + this.status );
      }
      xhr.send();
  }
  //Загрузка разных объемов даных
  loadSmall = () => {
    this.setState({searhingComplete: false, searching: false, reRenderTable: true})
    this.loadData('http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D')
  }
  loadBig = () => {
    this.setState({searhingComplete: false, searching: false, reRenderTable: true})
    this.loadData('http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D')
  }
  //Сортировка записей
  numberSort = (e) =>{
    let targetId = e.currentTarget.id
    let sortFunction = ''
    if(targetId == 'id'){
      sortFunction = (a,b) =>{
        return a.id - b.id;
      }
      if(!this.state.columnList.id){
        this.state.downloaded.sort(sortFunction)
        this.setState({columnList: {id: !this.state.columnList.id}})
      }else{
        this.state.downloaded.reverse()
        this.setState({columnList: {id: !this.state.columnList.id}})
      }
      this.setState({sorted: true})
    }else if(targetId == 'firstName'){
      sortFunction = (a,b) =>{
        return a.firstName.charCodeAt(0) - b.firstName.charCodeAt(0)
      }
      if(!this.state.columnList.firstName){
        this.state.downloaded.sort(sortFunction)
        this.setState({columnList: {firstName: !this.state.columnList.firstName}})
      }else{
        this.state.downloaded.reverse()
        this.setState({columnList: {firstName: !this.state.columnList.firstName}})
      }
      this.setState({sorted: true})
    }else if(targetId == 'lastName'){
      sortFunction = (a,b) =>{
        return a.lastName.charCodeAt(0) - b.lastName.charCodeAt(0)
      }
      if(!this.state.columnList.lastName){
        this.state.downloaded.sort(sortFunction)
        this.setState({columnList: {lastName: !this.state.columnList.lastName}})
      }else{
        this.state.downloaded.reverse()
        this.setState({columnList: {lastName: !this.state.columnList.lastName}})
      }
      this.setState({sorted: true})
    }else if(targetId == 'email'){
      sortFunction = (a,b) => {
        return a.email.charCodeAt(0) - b.email.charCodeAt(0)
      }
      if(!this.state.columnList.email){
        this.state.downloaded.sort(sortFunction)
        this.setState({columnList: {email: !this.state.columnList.email}})
      }else{
        this.state.downloaded.reverse()
        this.setState({columnList: {email: !this.state.columnList.email}})
      }
      this.setState({sorted: true})
    }else if(targetId == 'phone'){
      sortFunction = (a,b) =>{
        return a.phone.substring(1,4) - b.phone.substring(1,4)
      }
      if(!this.state.columnList.phone){
        this.state.downloaded.sort(sortFunction)
        this.setState({columnList: {phone: !this.state.columnList.phone}})
      }else{
        this.state.downloaded.reverse()
        this.setState({columnList: {phone: !this.state.columnList.phone}})
      }
      this.setState({sorted: true})
    }
    this.setState({reRenderTable: true})
  }

  //Ввод в поиск
  chageInput = (e) =>{
    this.setState({inputValue: e.target.value})
  }
  //Поиск
  findInput = (e) =>{
    if (this.state.inputValue.length > 1){
    this.setState({searching: true})
      let downloaded = this.state.downloaded
      let searchArr = []
      let searList = downloaded.map((curr)=>{
        for(let key in curr){
          if(this.state.inputValue == curr[key]){
            searchArr.push(curr)
            this.setState({searching: false})
          }
        }
      })
      if(searchArr.length !== 0){
        let searchRes = searchArr.map((curr, y)=>{
          return(
            <tr key={y}>
              <td id={y} onClick={this.showInfo} className='App_section_table_td_id'>{curr.id}</td>
              <td>{curr.firstName}</td>
              <td>{curr.lastName}</td>
              <td>{curr.email}</td>
              <td>{curr.phone}</td>
            </tr>
          )
        })
        this.setState({showTable: searchRes})
      }else{
        this.setState({searching: false})
        let noRes = (<tr><td>Нет результатов</td></tr>)
        this.setState({showTable: noRes})
      }
    }
  }
  //Переключатель страниц
  changePage = (e) =>{
    let el = document.getElementsByClassName('Active_navigation_button')[0]
    if (el){el.classList.remove('Active_navigation_button')}
    e.target.className='Active_navigation_button'
    this.setState({showPageNumber:e.target.innerHTML, reRenderTable: true})
  }
  //Вывод развернутой информации о ком-то
  showInfo = (e) =>{
    let id = e.target.id
    this.setState({unfoldedInfo: [this.state.downloaded[id].description, this.state.downloaded[id].address]})
  }

  render() {
    let downloaded = this.state.downloaded
    let step = 50
    let arr =  []
    for(let i=0,y=0;i<downloaded.length;i+=step,y++){
      arr.push({})
      arr[y] = (downloaded.slice(i, i+step))
    }
    let elementList = arr.map((curr, i)=>{
      let page = curr.map((curr, y)=>{
        return(
          <tr key={y}>
            <td id={y} onClick={this.showInfo} className='App_section_table_td_id'>{curr.id}</td>
            <td>{curr.firstName}</td>
            <td>{curr.lastName}</td>
            <td>{curr.email}</td>
            <td>{curr.phone}</td>
          </tr>
        )
      })
      return(
          {page}
      )
    })

    //постраничный вывод
    if(this.state.showTable == 0 && this.state.isLoad){
      this.setState({showTable: elementList[0].page})
    }
    if(this.state.reRenderTable && this.state.isLoad){
      this.setState({showTable: elementList[this.state.showPageNumber].page})
      this.setState({reRenderTable: false})
    }

    //Переключатель страниц
    let navigationBar = arr.map((curr, i)=>{
      return(
        <button
        onClick={this.changePage}>
          {i+1}
        </button>
      )
    })

    //Поиск записей
    let searchBar = (
      <section>
        <input type='text' value={this.state.inputValue} placeholder = 'enter...' onChange={this.chageInput} className='App_searchBar_input'/>
        <button onClick={this.findInput} value={this.state.inputValue} className='App_searchBar_button'>find</button>
      </section>
    )
    //Сообщение о поиске записи
    let searchingMess = (
      <div>Ищу...</div>
    )

    //Заголовки таблицы
    let messageUp = 'Сортировать по возрастанию'
    let messageDown = 'Сортировать по убыванию'
    let table = (
      <div className='App_section_table_main'>
      <table className='App_section_table'>
        <tr>
          <th id={'id'} onClick={this.numberSort}>
            <h4>id</h4>
            <h6>
              {this.state.columnList.id ? messageDown:messageUp}
            </h6>
          </th>
          <th id={'firstName'} onClick={this.numberSort}>
            <h4>firstName</h4>
            <h6>
              {this.state.columnList.firstName ? messageDown:messageUp}
            </h6>
          </th>
          <th id={'lastName'} onClick={this.numberSort}>
            <h4>lastName</h4>
            <h6>
              {this.state.columnList.lastName ? messageDown:messageUp}
            </h6>
          </th>
          <th id={'email'} onClick={this.numberSort}>
            <h4>email</h4>
            <h6>
              {this.state.columnList.email ? messageDown:messageUp}
            </h6>
          </th>
          <th id={'phone'} onClick={this.numberSort}>
            <h4>phone</h4>
            <h6>
              {this.state.columnList.phone ? messageDown:messageUp}
            </h6>
          </th>
        </tr>
        {this.state.showTable}
      </table>
      <div className='App_table_navigationBar'>
      {navigationBar.length>1 && this.state.downloaded.length > 50 ? navigationBar : ''}
      </div>
      </div>
    )
    //Расширенная информация о ком-то
    let description = ''
    if (this.state.unfoldedInfo.length > 1){
    description = (
      <section>
        <p>{this.state.unfoldedInfo[0]}</p>
        <ul>
          <li>Адрес проживания: <b>{this.state.unfoldedInfo[1].streetAddress}</b></li>
          <li>Город: <b>{this.state.unfoldedInfo[1].city}</b></li>
          <li>Провинция/штат: <b>{this.state.unfoldedInfo[1].state}</b></li>
          <li>Индекс: <b>{this.state.unfoldedInfo[1].zip}</b></li>
        </ul>
      </section>
    )
    }
    return (
      <div className="App">
          <div className='App_Button_section'>
            <button onClick={this.loadSmall} className='App_button_section_someButton'>Small</button>
            <button onClick={this.loadBig} className='App_button_section_someButton'>Big</button>
          </div>
          <div className='App_main_section'>
            {this.state.loadPreviewShow ? <div className='Load_preview_container'><div className='Load_preview'></div></div>: ''}
            {this.state.isLoad ? searchBar : ''}
            {this.state.searching ? searchingMess : ''}
            {this.state.isLoad ? table : ''}
          </div>
          <div>
            {this.state.isLoad && this.state.unfoldedInfo.length > 1 ? description : ''}
          </div>
      </div>
    )
  }
}

export default App;
