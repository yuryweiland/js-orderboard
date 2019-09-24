var orders = [];
var processingOrdersList = document.getElementById('processingOrders');
var readyOrdersList = document.getElementById('readyOrders');

var processingOrdersListFragment = document.createDocumentFragment();
var readyOrdersListFragment = document.createDocumentFragment();

/**
 * Render of order's record template
 * @param order
 * @returns {HTMLElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("div");
    orderRecord.className="order";
    orderRecord.innerHTML = '<p>' + order.orderNumber + '</p>';

    if (order.isLastReady && order.status === 'ready') {
        orderRecord.classList.add('last-ready')
    }

    return orderRecord;
}

/**
 * Generate "Cooking now" & "Ready" orders lists
 */
function generateOrderLists() {
    let processingResult = [];
    let readyResult = [];

    if (orders) {
        getObjectFromLocalStorage('orders').forEach((order) => {

            if (order.status === 'processing') {
                processingResult.push(renderOrder(order));
            } else if (order.status === 'ready') {
                readyResult.push(renderOrder(order));
            }

        });
    }

    for(var i = 0; i < processingResult.length; i++) {
        processingOrdersListFragment.appendChild(processingResult[i]);
    }
    for(var i = 0; i < readyResult.length; i++) {
        readyOrdersListFragment.appendChild(readyResult[i]);
    }

    processingOrdersList.appendChild(processingOrdersListFragment);
    readyOrdersList.appendChild(readyOrdersListFragment);

    reverseChildNodes(processingOrdersList);
    reverseChildNodes(readyOrdersList);

}

/**
 * Refresh orders list with interval (in milliseconds)
 */
function refreshOrderLists() {
    window.setInterval(function() {
        processingOrdersList.innerHTML = '';
        readyOrdersList.innerHTML = '';
        generateOrderLists();
    }, 1000); // set number in milliseconds here (ex., 1000 for 1 sec time interval)
}

generateOrderLists();
refreshOrderLists();
