/**
 * Set orders to localStorage
 */
function setOrdersToLocalStorage(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Returns Javascript object by localStorage key
 * @param objectName
 * @returns {any}
 */
function getObjectFromLocalStorage(objectName) {
    return JSON.parse(localStorage.getItem(objectName));
}

/**
 * Reverse child nodes in orders lists (HTML fragments)
 * @param node
 * @returns {*}
 */
function reverseChildNodes(node) {
    var parentNode = node.parentNode, nextSibling = node.nextSibling,
        frag = node.ownerDocument.createDocumentFragment();
    parentNode.removeChild(node);
    while(node.lastChild)
        frag.appendChild(node.lastChild);
    node.appendChild(frag);
    parentNode.insertBefore(node, nextSibling);
    return node;
}

/**
 * Set test orders data to localStorage
 */
function setTestOrdersToLocalStorage() {
    localStorage.setItem('orders', JSON.stringify([
        {
            id: 1,
            status: 'ready',
            orderNumber: '12',
            isLatestReady: false
        },
        {
            id: 2,
            status: 'processing',
            orderNumber: '13',
            isLatestReady: false
        },
        {
            id: 3,
            status: 'processing',
            orderNumber: '14',
            isLatestReady: false
        },
        {
            id: 4,
            status: 'processing',
            orderNumber: '15',
            isLatestReady: false
        },
        {
            id: 5,
            status: 'ready',
            orderNumber: '16',
            isLatestReady: true
        },
        {
            id: 6,
            status: 'processing',
            orderNumber: '17',
            isLatestReady: false
        },
    ]));
}