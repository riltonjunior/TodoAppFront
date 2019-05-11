import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoForm from './todoForm'
import TodoList from './todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {
  constructor(props) { // Preciso estudar mais
    super(props)
    this.state = { description: '', list: []}

    
    this.handlerChange = this.handlerChange.bind(this)
    this.handlerAdd = this.handlerAdd.bind(this)
    this.handlerSearch = this.handlerSearch.bind(this)
    this.handlerClear = this.handlerClear.bind(this)

    this.handlerRemove = this.handlerRemove.bind(this) 
    this.handlerMarkAsDone = this.handlerMarkAsDone.bind(this)
    this.handlerMarkAsPending = this.handlerMarkAsPending.bind(this)

    this.refresh()
  }

  refresh(description = '') {
    const search = description ? `&description__regex=/${description}/` : ''
    axios.get(`${URL}?sort=-createdAt${search}`)
      .then(resp => this.setState({...this.state, description, list: resp.data}))
  }

  handlerChange(e) {
    this.setState({...this.state, description: e.target.value})
  }

  handlerAdd() {
   const description = this.state.description
   axios.post(URL, { description })
    .then( resp => this.refresh())
  }

  handlerRemove(todo) {
    axios.delete(`${URL}/${todo._id}`)
      .then(resp => this.refresh(this.state.description))
  }

  handlerMarkAsDone(todo) {
    axios.put(`${URL}/${todo._id}`, { ...todo, done: true })
      .then(resp => this.refresh(this.state.description))
  }

  handlerMarkAsPending(todo) {
    axios.put(`${URL}/${todo._id}`, { ...todo, done: false })
      .then(resp => this.refresh(this.state.description))
  }

  handlerSearch() {
    this.refresh(this.state.description)
  }

  handlerClear() {
    this.refresh()
  }

  render() {
    return (
      <div>
         <PageHeader name='Tarefas' small='Cadastro'></PageHeader>
         <TodoForm 
          description={this.state.description}
          handlerChange={this.handlerChange}
          handlerSearch={this.handlerSearch}
          handlerClear={this.handlerClear}
          handlerAdd={this.handlerAdd} />
         <TodoList 
          list={this.state.list} 
          handlerMarkAsDone={this.handlerMarkAsDone}
          handlerMarkAsPending={this.handlerMarkAsPending}
          handlerRemove={this.handlerRemove}
          />
      </div>
    )
  }
}

