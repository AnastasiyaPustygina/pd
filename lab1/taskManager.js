class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentId = 1;
    }

    addTask(description, status = 'todo') {
        if (typeof description !== 'string' || !description || (status && typeof status !== 'string')) {
            throw new Error('INVALIDE_ARGUMENT');
        }
        const validStatuses = ['todo', 'inProgress', 'done'];
        if (!validStatuses.includes(status)) {
            throw new Error('INVALIDE_STATUS');
        }

        this.tasks.push({ id: this.currentId++, description, status: status || 'todo' });
    }

    deleteTask(id) {
        if (typeof id !== 'number') {
            throw new Error('INVALIDE_ARGUMENT');
        }
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            return true;
        }
        return false;
    }

    changeStatus(id, status) {
        if (typeof id !== 'number' || !status) {
            throw new Error('INVALIDE_ARGUMENT');
        }
        const validStatuses = ['todo', 'inProgress', 'done'];
        if (!validStatuses.includes(status)) {
            throw new Error('INVALIDE_STATUS');
        }
        const task = this.tasks.find(task => task.id === id);
        if (!task || task.status === status) {
            return false;
        }
        task.status = status;
        return true;
    }

    showList() {
        const groupedTasks = {todo: [], inProgress: [],done: []};
        this.tasks.forEach(task => {
            groupedTasks[task.status].push(`${task.id} "${task.description}"`);
        });
        console.log('Todo:');
        console.log(groupedTasks.todo.length > 0 ? groupedTasks.todo.join(',\n') : '-');
        console.log('In Progress:');
        console.log(groupedTasks.inProgress.length > 0 ? groupedTasks.inProgress.join(',\n') : '-');
        console.log('Done:');
        console.log(groupedTasks.done.length > 0 ? groupedTasks.done.join(',\n') : '-');
    }
}
