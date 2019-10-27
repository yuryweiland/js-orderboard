var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];

// Настройки приложения
var appSettings = {
    enableAdvert: false,
    advertFiles: []
};

var orderNumberInputs = document.querySelectorAll('.orderNumberInput');
var updateOrderNumberButtons = document.querySelectorAll('.updateOrderNumber');

var processingButtons = document.querySelectorAll('.processingOrder');
var readyButtons = document.querySelectorAll('.readyOrder');
var removeButtons = document.querySelectorAll('.removeOrder');

var ordersTable = document.getElementById('ordersTable');
var ordersListFragment = document.createDocumentFragment();

var addNewOrderButton = document.getElementById('addNewOrderButton');
var newOrderNumber = document.getElementById('newOrderNumber');
var enableAdvertCheckbox = document.getElementById('enableAdvertCheckbox');
var enableAdvertInfo = document.getElementById('enableAdvertInfo');
var advertFileInput = document.getElementById('advertFileInput');

var todayDate = new Date();
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

var todayISODate = todayDate.toISOString();

function getOrdersFromLocalStorage() {
    orders = getObjectFromLocalStorage('orders');

    generateOrderTable();
    initProcessingButtonsElements();
    initReadyButtonsElements();
    initRemoveButtonsElements();
    initUpdateOrderNumberButtonsElements();
}

/**
 * Показать все заказы за сегодня
 * @param todayISODate
 * @returns {*[]}
 */
function setDayOrders(todayISODate) {
    dayOrders = orders.filter((order) => order.date === todayISODate);
    localStorage.setItem('dayOrders', JSON.stringify(dayOrders));
}

/**
 * Показать заказы в работе на данный момент
 * @param todayISODate
 * @returns {*[]}
 */
function setProcessingOrders(todayISODate) {
    processingOrders = orders.filter((order) => order.date === todayISODate && order.status === 'processing');
    localStorage.setItem('processingOrders', JSON.stringify(processingOrders));
}

/**
 * Показать готовые заказы на данный момент
 * @param todayISODate
 * @returns {*[]}
 */
function showReadyOrders(todayISODate) {
    readyOrders = orders.filter((order) => order.date === todayISODate && order.status === 'ready');
    localStorage.setItem('readyOrders', JSON.stringify(readyOrders));
}

/**
 * Добавление нового заказа
 * @param orderNumber
 * @param status
 */
function addNewOrder(orderNumber, status) {
    let setOrderId;

    if (typeof orders === 'undefined' || !orders.length || orders === null) {
        setOrderId = 1;
    } else {
        setOrderId = orders[orders.length - 1].id + 1;
    }

    // Формируем объект с новым заказом
    const newOrder = {
        id: setOrderId,
        status: status,
        orderNumber: orderNumber.toString(),
        isLastReady: false
    };

    // Убираем метку isLastReady для всех заказов
    unmarkLastReadyOrder(orders);

    // Добавляем новый заказ
    orders.push(newOrder);

    // Сбрабсываем номер нового заказа в форме
    newOrderNumber.value = '';

    setOrdersToLocalStorage(orders);
    getOrdersFromLocalStorage();
}

/**
 * Изменение ранее добавленного заказа
 * @param order
 * @param newOrderNumber
 * @param newStatus
 */
function editOrder(order, newOrderNumber, newStatus) {
    if (newOrderNumber) {
        for (var i in orders) {
            if (orders[i].id === order.id) {
                orders[i].orderNumber = newOrderNumber;
                break;
            }
        }
    }

    if (newStatus) {

        for (var i in orders) {
            if (orders[i].id === order.id) {
                orders[i].status = newStatus;

                if (newStatus === 'ready') {
                    // Убираем метку isLastReady для всех заказов
                    unmarkLastReadyOrder(orders);

                    // Помечаем заказ как последний готовый
                    orders[i].isLastReady = true;
                }

                break;
            }
        }
    }

    setOrdersToLocalStorage(orders);
    getOrdersFromLocalStorage();
}

/**
 * Удаление заказа
 * @param orderId
 */
function deleteOrder(orderId) {
    const updatedOrders = orders.filter((order) => order.id !== +orderId);

    setOrdersToLocalStorage(updatedOrders);
    getOrdersFromLocalStorage();
}

/**
 * Рендерим внешний вид записи о заказе в таблице
 * @param order
 * @returns {HTMLDivElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("tr");
    let statusMessage = '';

    if (order.status === 'processing') {
        statusMessage = 'Готовится';
    } else if (order.status === 'ready') {
        statusMessage = 'Готов';
    }

    orderRecord.innerHTML = '<td class="order-number"><input value="' + order.orderNumber +'" orderNumber="' + order.orderNumber + '" id="orderNumberInput_'+ order.id +'"> <button class="updateOrderNumber"  orderId="' + order.id + '"  orderNumber="' + order.orderNumber + '">Обновить</button></td>' +
        '<td width="129">' + statusMessage + '</td>' +
        '<td width="400">' +
        '<button class="processingOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Отправить в "Готовится"</button> ' +
        '<button class="readyOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Отправить в "Готовые"</button> ' +
        '<button class="removeOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Удалить</button>' +
        '</td>';
    return orderRecord;
}

/**
 * Убираем пометку isLastReady у всех текущих заказов
 * @param orders
 */
function unmarkLastReadyOrder(orders) {
    orders.forEach((o) => {
        o.isLastReady = false;
    });
}

/**
 * Генерируем в html таблицу с заказами
 */
function generateOrderTable() {
    let result = [];
    ordersTable.innerHTML = '';

    if (orders) {
        getObjectFromLocalStorage('orders').forEach((order) => {
            result.push(renderOrder(order));
        });
    }

    for(var i = 0; i < result.length; i++) {
        ordersListFragment.appendChild(result[i]);
    }

    ordersTable.appendChild(ordersListFragment);
    reverseChildNodes(ordersTable);

    removeButtons = document.querySelectorAll('.removeOrder');
    processingButtons = document.querySelectorAll('.processingOrder');
    readyButtons = document.querySelectorAll('.readyOrder');
}

/**
 * Обработчик кнопки "Отправить в Готовые" для заказов
 */
function initReadyButtonsElements() {
    readyButtons = document.querySelectorAll('.readyOrder');

    for (var i = 0; i < readyButtons.length; i++) {
        readyButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");
            let orderNumber = this.getAttribute("orderNumber");

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, orderNumber, 'ready');
        });
    }
}

/**
 * Обработчик кнопки "Отправить в Готовится" для заказов
 */
function initProcessingButtonsElements() {
    processingButtons = document.querySelectorAll('.processingOrder');

    for (var i = 0; i < processingButtons.length; i++) {
        processingButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");
            let orderNumber = this.getAttribute("orderNumber");

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, orderNumber, 'processing');
        });
    }
}

/**
 * Обработчик кнопки "Удалить" для заказов
 */
function initRemoveButtonsElements() {
    removeButtons = document.querySelectorAll('.removeOrder');

    for (var i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");

            deleteOrder(orderId);
        });
    }
}

/**
 * Обработчик кнопки "Обновить" для номеров заказов
 */
function initUpdateOrderNumberButtonsElements() {
    updateOrderNumberButtons = document.querySelectorAll('.updateOrderNumber');
    orderNumberInputs = document.querySelectorAll('.orderNumberInput');

    for (var i = 0; i < updateOrderNumberButtons.length; i++) {
        updateOrderNumberButtons[i].addEventListener('click', function() {
            let orderId = this.getAttribute("orderId");
            let inputId = 'orderNumberInput_' + orderId;

            // Получаем значение из инпута с номером заказа
            let newOrderNumberValue = document.getElementById(inputId).value;

            // Определяем, над каким заказом производим действия
            let order = orders.filter((order) => order.id === +orderId)[0];

            // Обновляем статус заказа на "Готовится"
            editOrder(order, newOrderNumberValue, order.status);
        });
    }
}

/**
 * Читаем выбранные файлы и добавляем их в рекламный блок
 * @param evt
 */
function readAdvertFiles(evt) {
    //Получаем список файлов из fileInput-а
    var files = evt.target.files;

    if (files) {
        // Если выбраны файлы - обновляем список файлов в appSettings
        appSettings.advertFiles = [];

        for (var i = 0, f; f = files[i]; i++) {
            var r = new FileReader();
            r.onload = (function(f) {
                return function() {
                    appSettings.advertFiles.push('advert/' + f.name);

                    // Сохраняем пути файлов в localStorage
                    setAppSettingsToLocalStorage(appSettings);
                };
            })(f);

            r.readAsText(f);
        }

    } else {
        alert("Ошибка загрузки файлов");
    }

}

/**
 * Обработчик кнопки добавления нового заказа
 * (заказ добавляется в статус "готовится")
 */
addNewOrderButton.addEventListener('click', function() {
    addNewOrder(newOrderNumber.value, 'processing');
});

/**
 * Обработчик действий с полем ввода номера заказа
 */
// На нажатие любой кнопки
newOrderNumber.addEventListener('keyup', function() {
    addNewOrderButton.disabled = !this.value;
});

// На нажатие кнопки Enter
newOrderNumber.addEventListener('keypress', function(e) {
    var key = e.key;
    if (key === 'Enter') {
        addNewOrder(newOrderNumber.value, 'processing');
    }
});

/**
 * Обработчик клика чекбокса "Отображать рекламный блок на Табло заказов"
 */
enableAdvertCheckbox.addEventListener('change', function(e) {
    e.target.checked ? appSettings.enableAdvert = true : appSettings.enableAdvert = false;
    setAppSettingsToLocalStorage(appSettings);
    enableAdvertInfo.classList.toggle('hidden');
});

advertFileInput.addEventListener('change', readAdvertFiles, false);

// Сохраняем настройки приложения в localstorage
setAppSettingsToLocalStorage(appSettings);

// Сохраняем заказы в localstorage
setOrdersToLocalStorage(orders);

// Получаем настройки приложения из localstorage
getObjectFromLocalStorage('appSettings');

// Получаем все заказы из localStorage
getOrdersFromLocalStorage();
addNewOrderButton.disabled = true;
