// Pure jQuery cookie management using jQuery patterns
var CookieManager = {
    set: function(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
        return this; // jQuery-style chaining
    },
    
    get: function(name) {
        var nameEQ = name + "=";
        var cookies = document.cookie.split(';');
        
        // Use jQuery's map() function for array processing
        var result = $.map(cookies, function(cookie) {
            cookie = $.trim(cookie); // jQuery's trim method
            return cookie.indexOf(nameEQ) === 0 ? cookie.substring(nameEQ.length) : null;
        });
        
        return result.length > 0 ? result[0] : null;
    }
};

// Pure jQuery save function with method chaining and map()
function saveTodoList() {
    var todos = $('#ft_list .todo-item').map(function() {
        return $(this).text();
    }).get(); // Convert jQuery object to array
    
    CookieManager.set('ft_list_todos', JSON.stringify(todos), 365);
    
    // Trigger custom jQuery event for extensibility
    $(document).trigger('todolist:saved', [todos]);
}

// Pure jQuery load function with deferred pattern and each()
function loadTodoList() {
    var savedTodos = CookieManager.get('ft_list_todos');
    var $ftList = $('#ft_list');
    
    // Use jQuery's when() for promise-like handling
    return $.when(savedTodos).then(function(data) {
        if (data) {
            try {
                var todos = JSON.parse(data);
                
                if (todos.length > 0) {
                    $ftList.empty();
                    
                    // Use jQuery's each() instead of for loop
                    $.each(todos, function(index, todoText) {
                        createTodoElement(todoText, false);
                    });
                }
                
                // Trigger custom jQuery event
                $(document).trigger('todolist:loaded', [todos]);
            } catch (e) {
                console.error('Error loading saved TODOs:', e);
                $(document).trigger('todolist:error', [e]);
            }
        }
    });
}

// Pure jQuery element creation with method chaining and data storage
function createTodoElement(text, save) {
    var $ftList = $('#ft_list');
    
    // Remove empty message with jQuery chaining
    $ftList.find('.empty-message').fadeOut(200, function() {
        $(this).remove();
    });
    
    // Create new TODO using jQuery method chaining and data storage
    var $todoDiv = $('<div></div>', {
        'class': 'todo-item',
        'text': text,
        'data-todo-text': text, // Store original text in data attribute
        'data-created': Date.now() // Store creation timestamp
    })
    .hide() // Start hidden for animation
    .on('click.todo', function() {
        // Use namespaced events
        removeTodo($(this));
    })
    .prependTo($ftList)
    .fadeIn(300); // Animate in
    
    // Use jQuery data to track todo count
    var currentCount = $ftList.data('todo-count') || 0;
    $ftList.data('todo-count', currentCount + 1);
    
    // Save to cookies if requested using default parameter pattern
    save = (save !== false);
    if (save) {
        saveTodoList();
    }
    
    // Trigger custom jQuery event with todo data
    $(document).trigger('todo:created', [$todoDiv, text]);
}

// Pure jQuery add function with validation and chaining
function addNewTodo() {
    var todoText = prompt('Enter a new TO DO:');
    
    // Use jQuery's trim method and validation
    todoText = $.trim(todoText);
    
    // jQuery-style validation with short-circuit evaluation
    $.when(todoText && todoText.length > 0)
     .done(function() {
         createTodoElement(todoText, true);
     })
     .fail(function() {
         $(document).trigger('todo:invalid', [todoText]);
     });
}

// Pure jQuery remove function with animation and method chaining
function removeTodo($todoElement) {
    var todoText = $todoElement.data('todo-text') || $todoElement.text();
    var confirmRemove = confirm('Do you want to remove this TO DO?\n\n"' + todoText + '"');
    
    if (confirmRemove) {
        // Animate removal and use jQuery's promise system
        $todoElement.fadeOut(300).promise().done(function() {
            $(this).remove();
            
            var $ftList = $('#ft_list');
            var $remainingTodos = $ftList.find('.todo-item');
            
            // Update todo count using jQuery data
            $ftList.data('todo-count', $remainingTodos.length);
            
            // Check if list is empty using jQuery's length and method chaining
            if ($remainingTodos.length === 0) {
                $('<div></div>', {
                    'class': 'empty-message',
                    'text': 'No tasks yet. Click "New" to add one!'
                })
                .hide()
                .appendTo($ftList)
                .fadeIn(300);
            }
            
            // Update cookies and trigger custom event
            saveTodoList();
            $(document).trigger('todo:removed', [todoText]);
        });
    }
}

// Pure jQuery initialization with custom events and method chaining
$(function() {
    var $newBtn = $('#new-btn');
    var $ftList = $('#ft_list');
    
    // Initialize todo list data storage
    $ftList.data('todo-count', 0);
    
    // Load existing TODOs using jQuery's promise pattern
    loadTodoList().always(function() {
        // Setup event handlers with namespaced events and chaining
        $newBtn
            .on('click.todo', addNewTodo)
            .data('initialized', true);
        
        // Setup custom event listeners for extensibility
        $(document)
            .on('todolist:saved', function(event, todos) {
                console.log('Saved', todos.length, 'todos');
            })
            .on('todolist:loaded', function(event, todos) {
                console.log('Loaded', todos.length, 'todos');
            })
            .on('todo:created', function(event, $element, text) {
                console.log('Created todo:', text);
            })
            .on('todo:removed', function(event, text) {
                console.log('Removed todo:', text);
            })
            .on('todolist:error', function(event, error) {
                console.error('Todo list error:', error);
            });
    });
    
    // Optional: Add keyboard shortcuts using jQuery
    $(document).on('keydown.todo', function(e) {
        // Ctrl/Cmd + N for new todo
        if ((e.ctrlKey || e.metaKey) && e.which === 78) {
            e.preventDefault();
            addNewTodo();
        }
    });
});
