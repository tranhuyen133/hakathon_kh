"use strict";
var _a, _b, _c;
class TodoList {
    constructor() {
        this.id = 0;
        this.name = '';
        this.completed = false;
        this.todoList = JSON.parse(localStorage.getItem('todoList') || '[]');
    }
    renderJob() {
        const todoListContainer = document.getElementById('todoList');
        if (!todoListContainer)
            return;
        todoListContainer.innerHTML = '';
        this.todoList.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.completed;
            checkbox.dataset.id = String(item.id);
            checkbox.addEventListener('change', () => this.updateJob(item.id, checkbox.checked));
            const jobName = document.createElement('span');
            jobName.textContent = item.name;
            if (item.completed) {
                jobName.classList.add('completed');
            }
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group';
            const editButton = document.createElement('button');
            editButton.textContent = 'Sửa';
            editButton.className = 'btn btn-primary';
            editButton.addEventListener('click', () => this.editJob(item.id));
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Xóa';
            deleteButton.className = 'btn btn-danger';
            deleteButton.addEventListener('click', () => this.openDeleteModal(item.id));
            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);
            listItem.appendChild(checkbox);
            listItem.appendChild(jobName);
            listItem.appendChild(buttonGroup);
            todoListContainer.appendChild(listItem);
        });
        this.checkCompleted();
    }
    createJob(name) {
        if (!name.trim()) {
            alert('Tên công việc không được để trống.');
            return;
        }
        const existingJob = this.todoList.find(item => item.name === name);
        if (existingJob) {
            alert('Tên công việc không được phép trùng.');
            return;
        }
        const newJob = {
            id: ++this.id,
            name,
            completed: false
        };
        this.todoList.push(newJob);
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
        this.renderJob();
    }
    updateJob(id, completed) {
        const index = this.todoList.findIndex(item => item.id === id);
        if (index !== -1) {
            this.todoList[index].completed = completed;
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
            const jobName = document.querySelector(`[data-id='${id}'] + span`);
            if (jobName) {
                if (completed) {
                    jobName.classList.add('completed');
                }
                else {
                    jobName.classList.remove('completed');
                }
            }
        }
    }
    deleteJob(id) {
        const confirmDelete = confirm('Bạn có chắc muốn xóa công việc này?');
        if (confirmDelete) {
            this.todoList = this.todoList.filter(item => item.id !== id);
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
            this.closeDeleteModal();
        }
    }
    checkCompleted() {
        const allCompleted = this.todoList.every(item => item.completed);
        if (allCompleted && this.todoList.length > 0) {
            alert('Hoàn thành công việc!');
        }
    }
    openDeleteModal(id) {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        if (confirmDeleteButton) {
            confirmDeleteButton.dataset.id = String(id);
            const deleteModal = document.getElementById('deleteModal');
            if (deleteModal) {
                deleteModal.style.display = 'block';
            }
        }
    }
    closeDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
    }
}
const todoList = new TodoList();
(_a = document.getElementById('addButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    const jobNameInput = document.getElementById('jobName');
    const name = jobNameInput.value.trim();
    todoList.createJob(name);
    jobNameInput.value = '';
});
(_b = document.getElementById('confirmDeleteButton')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if (confirmDeleteButton) {
        const id = parseInt(confirmDeleteButton.dataset.id || '0');
        todoList.deleteJob(id);
    }
});
(_c = document.getElementById('cancelDeleteButton')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
    todoList.closeDeleteModal();
});
// Initial rendering
todoList.renderJob();
