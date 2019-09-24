var orders = [];
var dayOrders = [];
var processingOrders = [];
var readyOrders = [];

var orderNumberInputs = document.querySelectorAll('.orderNumberInput');
var updateOrderNumberButtons = document.querySelectorAll('.updateOrderNumber');

var processingButtons = document.querySelectorAll('.processingOrder');
var readyButtons = document.querySelectorAll('.readyOrder');
var removeButtons = document.querySelectorAll('.removeOrder');

var ordersTable = document.getElementById('ordersTable');
var setTestOrdersButton = document.getElementById('setTestOrders');
var ordersListFragment = document.createDocumentFragment();

var addNewOrderButton = document.getElementById('addNewOrderButton');
var newOrderNumber = document.getElementById('newOrderNumber');

var todayDate = new Date();
todayDate.setMinutes(0);
todayDate.setSeconds(0);
todayDate.setMilliseconds(0);

// Will be used in future for orders statistic
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
 * Add new order
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

    // Create new order object
    const newOrder = {
        id: setOrderId,
        status: status,
        orderNumber: orderNumber.toString(),
        isLastReady: false
    };

    // Remove mark "isLastReady" for all orders
    unmarkLastReadyOrder(orders);

    // Add new order to array
    orders.push(newOrder);

    // Clear new order number input value
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
                    // Remove mark "isLastReady" for all orders
                    unmarkLastReadyOrder(orders);

                    // mark order as last ready
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
 * Remove order
 * @param orderId
 */
function deleteOrder(orderId) {
    const updatedOrders = orders.filter((order) => order.id !== +orderId);

    setOrdersToLocalStorage(updatedOrders);
    getOrdersFromLocalStorage();
}

/**
 * Render order record in panel
 * @param order
 * @returns {HTMLElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("tr");
    let statusMessage = '';

    if (order.status === 'processing') {
        statusMessage = 'Готовится';
    } else if (order.status === 'ready') {
        statusMessage = 'Готов';
    }

    orderRecord.innerHTML = '<td class="order-number"><input value="' + order.orderNumber +'" orderNumber="' + order.orderNumber + '" id="orderNumberInput_'+ order.id +'"> <button class="updateOrderNumber"  orderId="' + order.id + '"  orderNumber="' + order.orderNumber + '">Rename</button></td>' +
        '<td width="129">' + statusMessage + '</td>' +
        '<td width="400">' +
        '<button class="processingOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Mark as "Cooking now"</button> ' +
        '<button class="readyOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Mark as "Ready"</button> ' +
        '<button class="removeOrder" orderId="' + order.id + '" orderNumber="' + order.orderNumber + '">Remove</button>' +
        '</td>';
    return orderRecord;
}

/**
 * Remove isLastReady mark for all orders
 * @param orders
 */
function unmarkLastReadyOrder(orders) {
    orders.forEach((o) => {
        o.isLastReady = false;
    });
}

/**
 * Generate order table-list in panel
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
 * Handler for button "Mark as Ready"
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
 * Handler for button "Mark as Cooking now"
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
 * Handler for button "Remove"
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
 * Handler for button "Rename"
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
 * Handler for button "Set test orders data"
 */
if (setTestOrdersButton) {
    setTestOrdersButton.addEventListener('click', function() {
        setTestOrdersToLocalStorage();
        getOrdersFromLocalStorage();
    });
}

/**
 * Handler for button "Add new order"
 * (new order sets in "Cooking now" status)
 */
addNewOrderButton.addEventListener('click', function() {
    addNewOrder(newOrderNumber.value, 'processing');
});

/**
 * Handler for "new oder number" input field
 */
// On any key pressed
newOrderNumber.addEventListener('keyup', function() {
    addNewOrderButton.disabled = !this.value;
});

// On "Enter" key pressed
newOrderNumber.addEventListener('keypress', function(e) {
    var key = e.key;
    if (key === 'Enter') {
        addNewOrder(newOrderNumber.value, 'processing');
    }
});


// Set all orders in localStorage
setOrdersToLocalStorage(orders);

// Get all orders from localStorage
getOrdersFromLocalStorage();

// disable "Add new Order" button by default
addNewOrderButton.disabled = true;