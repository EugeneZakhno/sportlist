document.addEventListener('DOMContentLoaded', function() {
    const morningList = document.getElementById('morning-list');
    const afternoonList = document.getElementById('afternoon-list');
    const eveningList = document.getElementById('evening-list');
    const clearBtn = document.getElementById('clear-todos');
    const addButtons = document.querySelectorAll('.add-btn');
    const toggleBtn = document.getElementById('toggle-hidden');
    let isHidden = false;

    const defaultTodos = {
        morning: [
            { text: 'ÐŸÐ Ð•Ð¡Ð¡ ÐšÐÐ§ÐÐ¢', completed: false },
            { text: 'Ð¢) Ð‘Ð•Ð“Ð˜Ð¢', completed: false },
            { text: 'Ð¢Ð£Ð ÐÐ˜Ðš', completed: false },
            { text: 'ÐÐÐ–Ð£ÐœÐÐÐ¯', completed: false }
        ],
        afternoon: [],
        evening: [
            { text: 'ÐŸÐ Ð•Ð¡Ð¡ ÐšÐÐ§ÐÐ¢', completed: false },
            { text: 'Ð‘Ð•Ð“Ð˜Ð¢', completed: false },
            { text: 'Ð¢Ð£Ð ÐÐ˜Ðš', completed: false },
            { text: 'ÐÐÐ–Ð£ÐœÐÐÐ¯', completed: false }
        ]
    };
    let todos = JSON.parse(localStorage.getItem('todos')) || defaultTodos;

    if (!todos.morning) {
        const oldTodos = todos;
        todos = {
            morning: oldTodos.filter(item => !item.section || item.section === 'morning'),
            afternoon: oldTodos.filter(item => item.section === 'afternoon'),
            evening: oldTodos.filter(item => item.section === 'evening')
        };
    }

    function renderTodos() {
        morningList.innerHTML = '';
        afternoonList.innerHTML = '';
        eveningList.innerHTML = '';

        renderSectionTodos('morning', morningList);
        renderSectionTodos('afternoon', afternoonList);
        renderSectionTodos('evening', eveningList);

        localStorage.setItem('todos', JSON.stringify(todos));

        // Hide empty sections and UI elements if toggle is on
        if (isHidden) {
            document.querySelectorAll('.section-block').forEach(section => {
                const list = section.querySelector('ul');
                if (!list.children.length) {
                    section.style.display = 'none';
                }
            });
            document.querySelectorAll('.add-btn, .edit-btn, .delete-btn').forEach(el => el.style.display = 'none');
        } else {
            document.querySelectorAll('.section-block').forEach(section => section.style.display = '');
            document.querySelectorAll('.add-btn, .edit-btn, .delete-btn').forEach(el => el.style.display = '');
        }
    }

    function renderSectionTodos(section, listElement) {
        todos[section].forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `list-group-item ${todo.completed ? 'completed' : ''}`;

            const number = document.createElement('span');
            number.className = 'todo-number';
            number.textContent = `${index + 1}.`;

            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;
            span.addEventListener('click', () => toggleTodo(section, index));

            const editBtn = document.createElement('span');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✏️';
            editBtn.addEventListener('click', () => startEditing(span, section, index));

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '❌';
            deleteBtn.addEventListener('click', () => deleteTodo(section, index));

            li.appendChild(number);
            li.appendChild(span);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            listElement.appendChild(li);
        });
    }

    function startEditing(span, section, index) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.value = span.textContent;

        input.addEventListener('blur', () => {
            const newText = input.value.trim();
            if (newText) {
                todos[section][index].text = newText;
                renderTodos();
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        span.replaceWith(input);
        input.focus();
    }

    function addTodo(section) {
        todos[section].push({
            text: '',
            completed: false
        });
        renderTodos();

        const lastTodo = todos[section].length - 1;
        const span = document.querySelector(`#${section}-list .list-group-item:last-child .todo-text`);
        startEditing(span, section, lastTodo);
    }

    function toggleTodo(section, index) {
        todos[section][index].completed = !todos[section][index].completed;
        renderTodos();
    }

    function deleteTodo(section, index) {
        todos[section].splice(index, 1);
        renderTodos();
    }

    function clearTodos() {
        todos = {
            morning: [],
            afternoon: [],
            evening: []
        };
        renderTodos();
    }

    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            addTodo(section);
        });
    });

    clearBtn.addEventListener('click', clearTodos);

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        isHidden = !isHidden;
        renderTodos();
    });

    renderTodos();
});