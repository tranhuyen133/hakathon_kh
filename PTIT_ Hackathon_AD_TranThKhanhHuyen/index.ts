interface ITodoList {
    id: number;
    name: string;
    completed: boolean;
}

class TodoList implements ITodoList {
    id: number;
    name: string;
    completed: boolean;
    todoList: ITodoList[];

    constructor() {
        this.id = 0;
        this.name = '';
        this.completed = false;
        this.todoList = JSON.parse(localStorage.getItem('todoList') || '[]');
    }

    renderJob(): void {
        const todoListContainer = document.getElementById('todoList');
        if (!todoListContainer) return;

        todoListContainer.innerHTML = '';
        this.todoList.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
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
            const actionIcons = document.createElement('div');
            actionIcons.className = 'action-icons';
            const editIcon = document.createElement('i');
            editIcon.className = 'fas fa-edit edit-icon';
            editIcon.addEventListener('click', () => this.editJob(item.id));
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash delete-icon';
            deleteIcon.addEventListener('click', () => this.openDeleteModal(item.id));
            actionIcons.appendChild(editIcon);
            actionIcons.appendChild(deleteIcon);
            listItem.appendChild(checkbox);
            listItem.appendChild(jobName);
            listItem.appendChild(actionIcons);
            todoListContainer.appendChild(listItem);
        });
        this.checkCompleted();
    }

    createJob(name: string): void {
        if (!name.trim()) {
            alert('Tên công việc không được để trống.');
            return;
        }
        const existingJob = this.todoList.find(item => item.name === name);
        if (existingJob) {
            alert('Tên công việc không được phép trùng.');
            return;
        }
        const newJob: ITodoList = {
            id: ++this.id,
            name,
            completed: false
        };
        this.todoList.push(newJob);
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
        this.renderJob();
    }

    updateJob(id: number, completed: boolean): void {
        const index = this.todoList.findIndex(item => item.id === id);
        if (index !== -1) {
            this.todoList[index].completed = completed;
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob(); 
            const jobName = document.querySelector(`[data-id='${id}'] + span`);
            if (jobName) {
                if (completed) {
                    jobName.classList.add('completed');
                } else {
                    jobName.classList.remove('completed');
                }
            }
        }
    }
    
    deleteJob(id: number): void {
        const confirmDelete = confirm('Bạn có chắc muốn xóa công việc này?');
        if (confirmDelete) {
            this.todoList = this.todoList.filter(item => item.id !== id);
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
            this.closeDeleteModal();
        }
    }

    checkCompleted(): void {
        const allCompleted = this.todoList.every(item => item.completed);
        if (allCompleted && this.todoList.length > 0) {
            alert('Hoàn thành công việc!');
        }
    }

    openDeleteModal(id: number): void {
        const confirmDeleteButton = document.getElementById('confirmDeleteButton');
        if (confirmDeleteButton) {
            confirmDeleteButton.dataset.id = String(id);
            const deleteModal = document.getElementById('deleteModal');
            if (deleteModal) {
                deleteModal.style.display = 'block';
            }
        }
    }

    closeDeleteModal(): void {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }
    }

    editJob(id: number): void {
       
        alert('Chỉnh sửa công việc có id: ' + id);
    }
}

const todoList = new TodoList();

document.getElementById('addButton')?.addEventListener('click', () => {
    const jobNameInput = document.getElementById('jobName') as HTMLInputElement;
    const name = jobNameInput.value.trim();
    todoList.createJob(name);
    jobNameInput.value = '';
});

document.getElementById('confirmDeleteButton')?.addEventListener('click', () => {
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    if (confirmDeleteButton) {
        const id = parseInt(confirmDeleteButton.dataset.id || '0');
        todoList.deleteJob(id);
    }
});

document.getElementById('cancelDeleteButton')?.addEventListener('click', () => {
    todoList.closeDeleteModal();
});

// Initial rendering
todoList.renderJob();
