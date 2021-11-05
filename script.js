function myFunction() {
    var input, filter, ul, li, a, i, txtValue
    input = document.getElementById('myInput')
    filter = input.value.toUpperCase()
    ul = document.getElementById('list')
    li = ul.getElementsByClassName('column')

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName('p')[0]
        txtValue = a.textContent || a.innerText
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ''
        } else {
            li[i].style.display = 'none'
        }
    }
}

var elements = document.getElementsByClassName('column')

var i

function listView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = '15%'
    }
}

function gridView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = '10%'
    }
}

'use strict';

class App {
    constructor() {
        this.addTaskBtn = document.querySelector('#add-task');
        this.modal = document.getElementById("myModal");
        this.span = document.getElementsByClassName("close")[0];
        this.addBtn = document.getElementById('btn-add-task');
        this.addInput = document.getElementById('input-task');
        this.currentDate = document.getElementById('due-date--input');

        this.itemsList = [];

        this._init();
        document.addEventListener('keydown', this._escModal.bind(this));
        this.span.addEventListener('click', this._hideModal.bind(this));
        window.addEventListener('click', this._clickOutsideModalClose.bind(this));

        this.addTaskBtn.addEventListener('click', this._showModal.bind(this));
        this.addInput.addEventListener('keydown', this._createTask.bind(this));
        this.addBtn.addEventListener('click', this._addNewTask.bind(this));
    }

    _escModal(e) {
        if (e.key === 'Escape')
            this.modal.style.display = "none";
    }

    _clickOutsideModalClose(e) {
        if (e.target === this.modal)
            this.modal.style.display = "none";
    }

    _showModal() {
        this.modal.style.display = "block";
        document.getElementById('input-task').focus();
    }

    _hideModal() {
        this.modal.style.display = "none";
    }

    _createTask(e) {
        if (e.key === 'Enter')
            this._addNewTask();
    }

    _setBackground(method) {
        let currentHour = 0;

        if (method === 'automatic') {
            currentHour = new Date().getHours();
        } else if (method === 'morning') {
            currentHour = 7;
        } else if (method === 'afternoon') {
            currentHour = 12;
        } else if (method === 'night') {
            currentHour = 19;
        }
    }

    _lineThroughText(i) {
        const itemToLineThrough = Array.from(document.querySelectorAll('.todo--tasks-list--item--description'));
        itemToLineThrough[i].classList.toggle('todo--tasks-list--item--description--checked');
    }

    _checkCheckBox(checkBox) {
        const processItem = function (element, i) {
            const toggleCheckBox = function () {
                element.classList.toggle('todo--tasks-list--item--checkbox--checked');
                this.itemsList[i].completed = !this.itemsList[i].completed;
                this._lineThroughText(i);
                this._setLocalStorage();
            }

            if (this.itemsList[i].completed) {
                element.classList.toggle('todo--tasks-list--item--checkbox--checked');
                this._lineThroughText(i);
            }
            element.addEventListener('click', toggleCheckBox.bind(this));
        }

        checkBox.forEach(processItem.bind(this));

    }

    _displayTasks() {
        const list = document.getElementById('todo--tasks-list--items-list');
        const li = document.querySelectorAll('li');
        li.forEach(element => {
            element.remove();
        })

        this._getLocalStorage();
        this.itemsList.reverse().forEach((_, i) => {
            list.insertAdjacentHTML('afterbegin', `<li class="todo--tasks-list--item">
            <div class="todo--tasks-list--item--checkbox"></div>
            <div class="todo--tasks-list--item--description">${this.itemsList[i].task}</div>
            <div class="todo--tasks-list--item--due-date">${this.itemsList[i].hasOwnProperty('dueDate') ? `<div class="due-date-bubble" style="padding: 2px;">${this.itemsList[i].dueDate}</div>` : ''}</div>
            <div class="delete-task"><img src="./images/remove.png" alt="" width="16px" height="16px"/>
                <div class="delete-text">Delete</div>
            </div>
        </li>`);
        });
        this.itemsList.reverse();
        const checkBox = document.querySelectorAll('.todo--tasks-list--item--checkbox');
        this._checkCheckBox(checkBox);
        this._updateDeleteButtons();
    }

    _updateDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.delete-task');
        deleteButtons.forEach((button) => {
            button.removeEventListener('click', () => { });
        });
        deleteButtons.forEach((button, i) => {
            button.addEventListener('click', () => {
                this.itemsList.splice(i, 1);

                this._setLocalStorage();
                this._displayTasks();
            });
        });
    }

    _addNewTask() {
        const newTask = {};
        const inputTask = document.getElementById('input-task');

        if (inputTask.value !== '') {
            newTask.task = inputTask.value;
            const dueDate = document.getElementById('due-date--input').value;
            if (dueDate !== '') {
                const dueDateArr = dueDate.split('-');
                newTask.dueDate = `${dueDateArr[2]}/${dueDateArr[1]}/${dueDateArr[0]}`;
            }
            newTask.completed = false;
            this.itemsList.unshift(newTask);

            this._setLocalStorage();

            this._displayTasks();

            this.modal.style.display = "none";
            inputTask.value = '';

        } else {

            inputTask.style.border = '1px solid red';
            inputTask.focus();
            setTimeout(() => inputTask.style.border = '1px solid #c9c9c9', 500);
        }
    }

    _setHeaderDate() {
        const locale = navigator.language;

        const dateOptionsDay = {
            weekday: 'long',
        }
        const dateOptionsDate = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }
        const day = new Intl.DateTimeFormat(locale, dateOptionsDay).format(new Date());
        const date = new Intl.DateTimeFormat(locale, dateOptionsDate).format(new Date());
        document.querySelector('#todo--header--today').textContent = day;
        document.querySelector('#todo--header--date').textContent = date;
    }

    _setLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.itemsList));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('tasks'));

        if (!data) return;

        this.itemsList = data;
    }

    _init() {
        this._setBackground('automatic');
        this._displayTasks();
        this._setHeaderDate();
    }
}
const app = new App();