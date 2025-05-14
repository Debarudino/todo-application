import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { TodoService } from "../todo.service"
import type { Todo } from "../todo.model"

@Component({
  selector: "app-todo",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.css"],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = []
  filteredTodos: Todo[] = []
  newTodoTitle = ""
  searchText = ""

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data.slice(0, 10)
      this.filteredTodos = [...this.todos]
    })
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) return

    const todo: Partial<Todo> = {
      userId: 1,
      title: this.newTodoTitle,
      completed: false,
    }

    this.todoService.addTodo(todo).subscribe((created) => {
      this.todos.unshift(created)
      this.filterTodos()
      this.newTodoTitle = ""
    })
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo.id, todo).subscribe()
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((t) => t.id !== id)
      this.filterTodos()
    })
  }

  editTodo(todo: Todo) {
    const newTitle = prompt("Edit task:", todo.title)
    if (newTitle !== null && newTitle.trim() !== "") {
      todo.title = newTitle
      this.updateTodo(todo)
    }
  }

  toggleComplete(todo: Todo) {
    todo.completed = !todo.completed
    this.updateTodo(todo)
  }

  filterTodos() {
    if (!this.searchText) {
      this.filteredTodos = [...this.todos]
    } else {
      this.filteredTodos = this.todos.filter((todo) => todo.title.toLowerCase().includes(this.searchText.toLowerCase()))
    }
  }

  onSearchChange() {
    this.filterTodos()
  }
}
