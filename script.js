
// const allLi = document.querySelectorAll('li')

// allLi.forEach( item => {
//     const li = document.createElement('li');
//     li.textContent = 'Replace All'

//     item.replaceWith(li);
// }) ;


// function replaceAllItems() {
//     const lis = document.querySelectorAll('li');

//     lis.forEach((item, index) => {
//         index === 1 ? item.innerHTML = 'Sencond Item' : item.innerHTML = 'Replace All'
//     })
// }

// replaceAllItems();


// function removeItem(itemNumber) {
//     const li = document.querySelectorAll('li')
//     li.forEach((itemNumber) => {
//         index.remove();
//     })
// }

// removeItem(1);


// const clearBtn = document.querySelector('#clear')

// clearBtn.addEventListener('click', () => {
//     const ul = document.querySelector('ul')
//     ul.remove();
// } )

const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const filterItem = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button')
let isEditMode = false;


const displayItems = () => {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
};


const onAddItemSubmit = e => {
     e.preventDefault();

    const newItem = itemInput.value;

    if (newItem === '') {
        alert('Please add an item');
        return;
    };

    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    }

    addItemToDOM(newItem);

    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
};

const addItemToDOM = item => {
    const li = document.createElement('li');
    // const newItemTextNode = document.createTextNode(newItem);
    li.append(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red')
    
    li.append(button);

    itemList.append(li);
};

const createButton = classes => {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.append(icon);
    return button;
};

const createIcon = classes => {
    const icon = document.createElement('i')
    icon.className = classes;
    return icon;
};

const addItemToStorage = item => {
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item)

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemFromStorage = () => {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null ){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    return itemsFromStorage;
};

const onClickItem = e => {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
        console.log(e.target)
    }
}


const checkIfItItemExists = item => {
    const itemsFromStorage = getItemFromStorage();

    if (itemsFromStorage.includes(item)){
        return true;
    } else {
        return false;
    }

}

const setItemToEdit = item => {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22'
    itemInput.value = item.textContent;
}

const removeItem = item => {
    if (confirm('Are you sure?')){
        item.remove();

        removeItemFromStorage(item.textContent);

        checkUI();
    }
};

const removeItemFromStorage = item => {
    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage = itemsFromStorage.filter(i => i != item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


const removeItems = () => {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');

    checkUI();
};

const itemFilter = e => {
    const items = document.querySelectorAll('li')
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = 'flex'
        } else
            item.style.display = 'none'
    });

};

const checkUI = () => {

    itemInput.value = '';

    const items = document.querySelectorAll('li')

    if(items.length === 0){
        clearBtn.style.display = 'none';
        filterItem.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        filterItem.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333'
    isEditMode = false;
}


const init = () => {
    
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', removeItems);
    filterItem.addEventListener('input', itemFilter);
    window.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
};

init();


