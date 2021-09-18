let input = document.getElementById("todoinput")
let todolist = document.getElementById("todolist")
let form = document.getElementById("form")
let itemsleft = document.getElementById("itemsleft")
let imagetoggle = document.getElementById("imagetoggle")




function getToDoListFromLocalStorage(){
    let stringifyList = localStorage.getItem("toDoList")
    let parsedList = JSON.parse(stringifyList)
    if (parsedList === null){
        return []
    }else{
        return parsedList
    }
}

let toDoList = getToDoListFromLocalStorage()
let toDoCount = toDoList.length

function validation(){
    let todoinput = input.value

    if (todoinput===null){
        alert("Enter valid Text")
        return
    }
    toDoCount+=1

    let newToDo = {
        text: todoinput,
        uniqueId : toDoCount,
        checked: false
    }
    toDoList.push(newToDo)
    createandappend(newToDo)
    input.value=""
    
    localStorage.setItem("toDoList",JSON.stringify(toDoList))
}

function labeltoggle(labelId,todoId){
    let labelElement = document.getElementById(labelId)
    labelElement.classList.toggle(checked)

    let labelIndex = toDoList.findIndex(function(todo){
        let labelElement = "todo"+todo.uniqueId
        if (labelElement===todoId){
            return true
        }
        else{
            return false
        }
    })

    let todoObject = toDoList[labelIndex]
    if (todoObject.checked===true){
        todoObject.checked = false
    }else{
        todoObject.checked=true
    }
}



function deletetodo(todoId){
    let todoelement =document.getElementById(todoId)
    todolist.removeChild(todoelement)

    let deleteElementIndex = toDoList.findIndex(function(eachtodo){
        let eachtodoId = "todo" + eachtodo.uniqueId
        if (eachtodoId === todoId){
                return true
        }else{
            return false
        }
    })
    toDoList.splice(deleteElementIndex,1)
}

function createandappend(todo) {
    let todoId = "todo" + todo.uniqueId
    let checkboxId = "checkbox" + todo.uniqueId
    let labelId = "label" + todo.uniqueId

    let todoelement = document.createElement("li")
    todolist.appendChild(todoelement)

    let inputElement = document.createElement("input")
    inputElement.type = "checkbox"
    inputElement.id = checkboxId
    inputElement.checked = todo.checked
    todoelement.appendChild(inputElement)

    let labelElement = document.createElement("label")
    labelElement.setAttribute("for",checkboxId)
    labelElement.id = labelId
    labelElement.textContent = todo.text
    todoelement.appendChild(labelElement)



    let deleteIcon = document.createElement("i")
    deleteIcon.classList.add("fas","fa-times")
    todoelement.appendChild(deleteIcon)

    deleteIcon.onclick = function(){
        deletetodo(todoId)
    }
    let totalitems = toDoList.length
console.log(totalitems)
itemsleft.textContent = totalitems + " items left"

}
form.addEventListener("submit",function(event){
    event.preventDefault()
    validation()
})

for(let todo of toDoList){
    createandappend(todo)
}


